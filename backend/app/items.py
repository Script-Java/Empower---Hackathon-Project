from flask import Blueprint, request, jsonify
from app.database import User,Item, db
from app.auth.require_token import token_required

items_bp = Blueprint('items', __name__, url_prefix='/items')

# Item routes
# All items dashboard
# Make sure to add Auth before user can edit or add items
@items_bp.route('/', methods=['GET', 'POST'])
@token_required
def items_dash(user: User):
    # Grabbing User ID json name from auth/__init__.py file in jwt_info
    try:
        user_id = request.json['sub']
        user_items_list = Item.query.filter_by(user_id=user.id).all()
        print(type(user_items_list))
        item_list = []
        # Grabbing each item in user items list
        for item in user_items_list:
            item_data = {
                "id": item.id,
                "title": item.title,
                "description": item.description,
                "date_posted": item.date_posted,
                "item_img": item.item_img
            }
            item_list.append(item_data)
        
        return jsonify({"user_items": item_list}), 200
    
    # if user cant access this
    except AttributeError:
        return jsonify({"message":"You are not authorized to access this"}), 400
    

# Functionality to add items
@items_bp.route('/add', methods=['GET', 'POST'])
def add_item():
    try:
        # here we are grabbing information and injectiong them inside DB
        # dont add date_posted because DB autmatically creates that field
        item_title = request.json["title"]
        description = request.json["description"]
        item_img = request.json["item_image"]
        # Grabbing User ID json name(sub) from auth/__init__.py file in jwt_info
        user_id = request.json['sub']
        
        new_item = Item(title=item_title,
                        description=description,
                        item_img=item_img,
                        user_id=user_id)
        
        db.session.add(new_item)
        db.session.commit()
        
        return jsonify({"message":"Item succesfully Added"}), 200
        # make sure to redirect here to item dashboard
    except Exception:
        return jsonify({"message":"Something went wrong"}), 500

# Functionality to remove items
@items_bp.route('/delete/<int:item_id>', methods=['GET', 'POST'])
def delete_item():
     # Grabbing User ID json name(sub) from auth/__init__.py file in jwt_info
    try:
        user_id = request.json['sub']
        item = Item.query.get(item_id)
    
        if not item:
            return jsonify({"message":"Item not found"}), 404
    
        if item.user_id != user_id:
            return jsonify({"message":"Unauthorized"}), 403
    
        db.session.delete(item)
        db.session.commit()

        return jsonify({"message":"Item deleted succesfully"}), 200

    except Exception:
        return jsonify({"message":"Something went wrong"}), 500 
    

# Functionality to update items
@items_bp.route('/edit/<int:item_id>', methods=['GET', 'POST'])
def edit_item():
    try:
        # Grabbing User ID json name(sub) from auth/__init__.py file in jwt_info
        user_id = request.json['sub']
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

        
