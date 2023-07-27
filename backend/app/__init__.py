from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import makedirs, path
from shutil import rmtree
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
app.config['SECRET_KEY'] = 'SECRET_KEY_CHANGE_FOR_PRODUCTION'
app.config["ADMIN_SECRET"] = "ADMIN_SECRET_CHANGE_FOR_PRODUCTION"


db = SQLAlchemy(app)

# Photos will be stored alongside the db.sqlite in the instance folder
if not path.exists(app.instance_path + '/photos'):
    makedirs(app.instance_path + '/photos')

from app.auth import auth_bp
app.register_blueprint(auth_bp, url_prefix='/auth')

from app.items import items_bp
app.register_blueprint(items_bp, url_prefix='/items')

@app.route('/migrate')
def migrate():
    with app.app_context():
        db.create_all()
    # Wipe photos folder when db is wiped
    rmtree(app.instance_path + '/photos')
    makedirs(app.instance_path + '/photos')
    
    return 'Migration complete', 200

if __name__ == '__main__':
    app.run(debug=True)