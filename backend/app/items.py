from flask import Blueprint, request, jsonify
from database import User,Item, db
from auth.require_token import token_required
from base64 import urlsafe_b64decode, b64encode, decode
from main import app
from os import remove
from geopy.distance import geodesic
from data_url import construct_data_url, DataURL
items_bp = Blueprint('items', __name__, url_prefix='/items')

# Item routes
# All items dashboard
@items_bp.route('/item_dashboard')
def items_dash():
    # fitering all items that are not claimed
    items = Item.query.filter_by(claimed=False).all()
    item_data = []
    # turning all items into a dict and appending them
    for item in items:
        item_data.append({
            'id': item.id,
            'name': item.name,
            'description': item.description,
            'claimed': item.claimed,
            'user_id': item.user_id
        })
    return jsonify({"all_items": item_data}), 200

# add auth before this
@items_bp.route('/claim/<int:item_id>', methods=['POST'])
def claim_item(item_id):
    item = Item.query.get(item_id)
    
    if not item:
        return jsonify({"error":"Item does not exist"}), 400
    
    if item.claimed:
        return jsonify({"error":"Item already claimed"}), 400

    item.claimed = True
    item.user_id = user.id
    db.session.commit()
    
    return jsonify({"message":"You have successfully claimed this item"}), 200

        
# Make sure to add Auth before user can edit or add items
@items_bp.route('/serve_img')
def serve_img():
    img_path = request.json["img_path"]
    with open(img_path, "rb") as f:
        dURL = construct_data_url(f.read())
        return jsonify({"img":dURL})
    
#Retrive all my items
@items_bp.route('/my')
@token_required
def items_dash(user: User):
    try:
        #The returned items will be in a list by default
        items = Item.query.filter_by(user_id=user.id).all()
        
        # Grabbing each item in user items list
        
        return jsonify({"user_items": items}), 200
    # Error handling
    except Exception as e:
        return jsonify({"message":"Something went wrong" + str(e)}), 500
    

# Functionality to add items
@items_bp.route('/add', methods=['POST'])
@token_required
def add_item(user: User):
    try:
        # here we are grabbing information and injectiong them inside DB
        # dont add date_posted because DB autmatically creates that field
        item_title = request.json["title"]
        description = request.json["description"]
        
        item_img_url = ""
        try:
            raw_b64 = request.json["item_image"]
            item_img_url = DataURL.from_url(raw_b64)
            # if item_img_url.mime_type != "image/jpeg" or item_img_url.mime_type != "image/png":
            #     return jsonify({"message":"Invalid file format" + str(item_img_url.mime_type)}), 400
            
        except Exception as e:
            print("Failed to decode image" + str(e))
            return jsonify({"message":"Failed to decode image" + str(e)}), 500
        coordinates = request.json["coordinates"]
        # Since the the item id:s are auto incrementing, we need to grab the last item id
        # and add 1 to it to get the new item id to link it to the image
        
        last_item_id = 0
        if Item.query.order_by(Item.id.desc()).first() != None:
            last_item_id = Item.query.order_by(Item.id.desc()).first().id
        if item_img_url.mime_type == "image/jpeg":
            img_path = f"{app.instance_path}/photos/{last_item_id+1}.jpg"
        else:
            img_path = f"{app.instance_path}/photos/{last_item_id+1}.png"
        # Grabbing User ID json name(sub) from auth/__init__.py file in jwt_info
        user_id = user.id
        new_item = Item(title=item_title,
                        description=description,
                        img_path=img_path,
                        user_id=user_id,
                        coordinates=coordinates)
        
        db.session.add(new_item)
        db.session.commit()
        with open(img_path, "wb") as f:
            f.write(item_img_url.data)
            # if(item_img_url.is_base64_encoded):
                
        
        return jsonify({"message":"Item succesfully Added", "data": str(item_img_url.data)}), 200
        # make sure to redirect here to item dashboard
    except Exception as e:
        return jsonify({"message":"Something went wrong" + str(e)}), 500

# Functionality to remove items
@items_bp.route('/delete/<int:item_id>')
@token_required
def delete_item(user:User, item_id: int):
     # Grabbing User ID json name(sub) from auth/__init__.py file in jwt_info
    try:
        user_id = user.id
        item = Item.query.get(item_id)
    
        if not item:
            return jsonify({"message":"Item not found"}), 404
    
        if item.user_id != user_id:
            return jsonify({"message":"Unauthorized"}), 403
    
        db.session.delete(item)
        db.session.commit()

        # Delete the image from the serve
        remove(item.img_path)
        return jsonify({"message":"Item deleted succesfully"}), 200

    except Exception:
        return jsonify({"message":"Something went wrong"}), 500 
    

# Functionality to update items
@items_bp.route('/edit/<int:item_id>')
@token_required
def edit_item(user: User, item_id: int):
    try:
        # Grabbing User ID json name(sub) from auth/__init__.py file in jwt_info
        user_id = user.id
        item = Item.query.get(item_id)
        
        if not item:
            return jsonify({"message":"Item not found"}), 404
        
        if item.user_id != user_id:
            return jsonify({"message":"Unauthorized"}), 403
        
        updated_title = request.json.get("title")
        updated_description = request.json.get("description")
        updated_item_img = request.json.get("item_image")
        if updated_title:
            item.title = updated_title
        if updated_description:
            item.description = updated_description
        if updated_item_img:
            item.item_img = updated_item_img
            
        db.session.commit()
        
        return jsonify({"message":"Item successfully updated"}), 200
    
    except Exception:
        return jsonify({"message":"Something went wrong"}), 500

def itemToDict(item: Item):
    return {
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "img_path": item.img_path,
        "user_id": item.user_id,
        "coordinates": item.coordinates
    }
        
@items_bp.route('/filter')
@token_required
def filter_items(user: User):
    #Gets the user coordinates from a tuple string in the db passed by the token_required decorator
    user_coord = tuple(map(float, user.coordinates.replace("(", "").replace(")", "").replace(" ", "").split(',')))
    #Gets the user max_distance from the db passed by the token_required decorator
    user_max_distance = user.max_distance
    with_images = request.args.get('with_images')
    acceptableItems = []
    for item in Item.query.all():
        #Calculates the distance between the user and the item using geodesic function from geopy library
        #If the distance is less than the user max_distance, then append the item to the list of acceptable items
        #If the distance is greater than the user max_distance, then skip the item and continue to the next item
        item_coord = tuple(map(float, item.coordinates.replace("(", "").replace(")", "").replace(" ", "").split(',')))
        if geodesic(user_coord, item_coord).km <= user_max_distance:
            acceptableItems.append(itemToDict(item))
        if with_images:
            for item in acceptableItems:
                with open(item["img_path"], "rb") as f:
                    mime_type = ""
                    if item["img_path"].endswith(".jpg"):
                        mime_type = "image/jpeg"
                    else:
                        mime_type = "image/png"
                    dURL = construct_data_url(
                        data=f.read(),
                        base64_encode=True,
                        mime_type=mime_type
                    )
                    item["img"] = dURL
        
    return jsonify({"items":acceptableItems}), 200