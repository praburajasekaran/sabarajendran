import pymysql

# Database settings
DB_NAME = 'sabarajendran'
DB_USER = 'root'
DB_PASSWORD = 'root'
DB_HOST = '127.0.0.1'
DB_PORT = 8889

def get_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_NAME,
        port=DB_PORT,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

def inspect_posts():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Get a few posts to see what they look like
            sql = "SELECT ID, post_title, post_content, post_type, post_status FROM wp_posts WHERE post_type != 'revision' AND post_status = 'publish' LIMIT 5"
            cursor.execute(sql)
            result = cursor.fetchall()
            for row in result:
                print(f"ID: {row['ID']}")
                print(f"Title: {row['post_title']}")
                print(f"Type: {row['post_type']}")
                print("-" * 20)
                
            # Check for custom post types if any "project" related
            sql = "SELECT DISTINCT post_type FROM wp_posts"
            cursor.execute(sql)
            types = cursor.fetchall()
            print("Post Types:", [t['post_type'] for t in types])

    finally:
        connection.close()

if __name__ == "__main__":
    inspect_posts()
