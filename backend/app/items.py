from flask import Blueprint, request, jsonify
from app.database import User,Item, db
from app.auth.require_token import token_required
from base64 import urlsafe_b64decode, b64encode, decode
from app import app
from os import remove
items_bp = Blueprint('items', __name__, url_prefix='/items')

# Item routes
# All items dashboard
# Make sure to add Auth before user can edit or add items
@items_bp.route('/serve_img/<int:item_id>', methods=['GET', 'POST'])
def serve_img(item_id:int):
    print(item_id)
    with open(f"{app.instance_path}/photos/{item_id}.jpg", "rb") as f:
        b64_img = b64encode(f.read())
        return jsonify({"img":b64_img.decode("utf-8")})
    

@items_bp.route('/', methods=['GET', 'POST'])
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
@items_bp.route('/add', methods=['GET', 'POST'])
@token_required
def add_item(user: User):
    try:
        # here we are grabbing information and injectiong them inside DB
        # dont add date_posted because DB autmatically creates that field
        item_title = request.json["title"]
        description = request.json["description"]
        item_img = urlsafe_b64decode(request.json["item_image"])
        # Since the the item id:s are auto incrementing, we need to grab the last item id
        # and add 1 to it to get the new item id to link it to the image
        
        last_item_id = 0
        if Item.query.order_by(Item.id.desc()).first() != None:
            last_item_id = Item.query.order_by(Item.id.desc()).first().id
        img_path = f"{app.instance_path}/photos/{last_item_id+1}.jpg"
        # Grabbing User ID json name(sub) from auth/__init__.py file in jwt_info
        user_id = user.id
        
        new_item = Item(title=item_title,
                        description=description,
                        img_path=img_path,
                        user_id=user_id)
        
        db.session.add(new_item)
        db.session.commit()
        with open(img_path, "wb") as f:
            f.write(item_img)
        
        return jsonify({"message":"Item succesfully Added"}), 200
        # make sure to redirect here to item dashboard
    except Exception as e:
        return jsonify({"message":"Something went wrong" + str(e)}), 500

# Functionality to remove items
@items_bp.route('/delete/<int:item_id>', methods=['GET', 'POST'])
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
@items_bp.route('/edit/<int:item_id>', methods=['GET', 'POST'])
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

        
