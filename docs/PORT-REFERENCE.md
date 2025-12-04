# Server Port Reference

**IMPORTANT: This site runs on PORT 8118, NOT the default 8888**

## Correct URLs:

### Frontend:
- Homepage: `http://localhost:8118/sabarajendran/`

### Backend:
- WordPress Admin: `http://localhost:8118/sabarajendran/wp-admin/`
- Plugins: `http://localhost:8118/sabarajendran/wp-admin/plugins.php`
- Themes: `http://localhost:8118/sabarajendran/wp-admin/themes.php`

### Database:
- Database Port: `8118`
- Database Name: `sabarajendran`
- Database User: `root`
- Database Password: `root`
- Database Host: `localhost:8118`

## wp-config.php Configuration:
```php
define( 'DB_HOST', 'localhost:8118' );
```

## Always Use Port 8118!

When accessing this site or configuring any tools, always remember to use port **8118**, not 8888.

---
*Last Updated: November 29, 2025*
