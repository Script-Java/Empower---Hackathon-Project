from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
app.config['SECRET_KEY'] = 'SECRET_KEY_CHANGE_FOR_PRODUCTION'
app.config["ADMIN_SECRET"] = "ADMIN_SECRET_CHANGE_FOR_PRODUCTION"

db = SQLAlchemy(app)

from app.auth import auth_bp
app.register_blueprint(auth_bp, url_prefix='/auth')

from app.items import items_bp
app.register_blueprint(items_bp, url_prefix='/items')

@app.route('/migrate')

def migrate():
    with app.app_context():
        db.create_all()
    return 'Migration complete', 200

if __name__ == '__main__':
    app.run(debug=True)