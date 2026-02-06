var express = require('express');
var router = express.Router();
let slugify = require('slugify');
let { IncrementalId } = require('../utils/IncrementalIdHandler');
let { data } = require('../utils/data');

// Dữ liệu categories
let categories = [
    {
        "id": 7,
        "name": "Clothes",
        "slug": "clothes",
        "image": "https://i.imgur.com/QkIa5tT.jpeg",
        "creationAt": "2026-02-05T16:51:34.000Z",
        "updatedAt": "2026-02-05T16:51:34.000Z"
    },
    {
        "id": 8,
        "name": "Electronics",
        "slug": "electronics",
        "image": "https://i.imgur.com/ZANVnHE.jpeg",
        "creationAt": "2026-02-05T16:51:35.000Z",
        "updatedAt": "2026-02-05T16:51:35.000Z"
    },
    {
        "id": 9,
        "name": "Furniture",
        "slug": "furniture",
        "image": "https://i.imgur.com/Qphac99.jpeg",
        "creationAt": "2026-02-05T16:51:36.000Z",
        "updatedAt": "2026-02-05T16:51:36.000Z"
    },
    {
        "id": 10,
        "name": "Shoes",
        "slug": "shoes",
        "image": "https://i.imgur.com/qNOjJje.jpeg",
        "creationAt": "2026-02-05T16:51:36.000Z",
        "updatedAt": "2026-02-05T16:51:36.000Z"
    },
    {
        "id": 11,
        "name": "Miscellaneous",
        "slug": "miscellaneous",
        "image": "https://i.imgur.com/BG8J0Fj.jpg",
        "creationAt": "2026-02-05T16:51:37.000Z",
        "updatedAt": "2026-02-05T16:51:37.000Z"
    },
    {
        "id": 13,
        "name": "gargantilla",
        "slug": "gargantilla",
        "image": "https://firebasestorage.googleapis.com/v0/b/pruebasalejandro-597ed.firebasestorage.app/o/gargantilla.jpg?alt=media&token=6bbf8234-5112-4ca8-b130-5e49ed1f3140",
        "creationAt": "2026-02-05T21:09:36.000Z",
        "updatedAt": "2026-02-05T21:09:36.000Z"
    },
    {
        "id": 15,
        "name": "category_B",
        "slug": "category-b",
        "image": "https://pravatar.cc/",
        "creationAt": "2026-02-05T22:04:27.000Z",
        "updatedAt": "2026-02-05T22:04:27.000Z"
    },
    {
        "id": 16,
        "name": "string",
        "slug": "string",
        "image": "https://pravatar.cc/",
        "creationAt": "2026-02-05T22:04:28.000Z",
        "updatedAt": "2026-02-05T22:04:28.000Z"
    },
    {
        "id": 17,
        "name": "Anillos",
        "slug": "anillos",
        "image": "https://firebasestorage.googleapis.com/v0/b/pruebasalejandro-597ed.firebasestorage.app/o/Anillos.jpg?alt=media&token=b7de8064-d4eb-4680-a4e2-ad917838c6c8",
        "creationAt": "2026-02-06T02:40:20.000Z",
        "updatedAt": "2026-02-06T02:40:20.000Z"
    },
    {
        "id": 18,
        "name": "Testing Category",
        "slug": "testing-category",
        "image": "https://placeimg.com/640/480/any",
        "creationAt": "2026-02-06T06:04:54.000Z",
        "updatedAt": "2026-02-06T06:04:54.000Z"
    }
];

// GET all categories - có thể truy vấn theo name
// URL: /api/v1/categories?name=clothes
router.get('/', function (req, res, next) {
    let nameQuery = req.query.name ? req.query.name : '';
    let result = categories.filter(function (category) {
        return (!category.isDeleted) && 
               category.name.toLowerCase().includes(nameQuery.toLowerCase());
    });
    res.status(200).send(result);
});

// GET category by ID
// URL: /api/v1/categories/7
router.get('/:id', function (req, res, next) {
    let id = parseInt(req.params.id);
    let result = categories.find(function (category) {
        return (!category.isDeleted) && category.id === id;
    });
    
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({
            message: "Category ID NOT FOUND"
        });
    }
});

// GET category by Slug
// URL: /api/v1/categories/slug/clothes
router.get('/slug/:slug', function (req, res, next) {
    let slug = req.params.slug;
    let result = categories.find(function (category) {
        return (!category.isDeleted) && category.slug === slug;
    });
    
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({
            message: "Category SLUG NOT FOUND"
        });
    }
});

// GET all products by category ID
// URL: /api/v1/categories/7/products
router.get('/:id/products', function (req, res, next) {
    let categoryId = parseInt(req.params.id);
    
    // Kiểm tra category có tồn tại không
    let category = categories.find(function (cat) {
        return (!cat.isDeleted) && cat.id === categoryId;
    });
    
    if (!category) {
        return res.status(404).send({
            message: "Category ID NOT FOUND"
        });
    }
    
    // Lọc tất cả products có category.id tương ứng
    let products = data.filter(function (product) {
        return (!product.isDeleted) && product.category.id === categoryId;
    });
    
    res.status(200).send(products);
});

// POST - Create new category
// URL: /api/v1/categories
router.post('/', function (req, res, next) {
    let newCategory = {
        id: IncrementalId(categories),
        name: req.body.name,
        slug: slugify(req.body.name, {
            replacement: '-',
            lower: true,
            locale: 'vi'
        }),
        image: req.body.image,
        creationAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    };
    
    categories.push(newCategory);
    res.status(201).send(newCategory);
});

// PUT - Edit category
// URL: /api/v1/categories/7
router.put('/:id', function (req, res, next) {
    let id = parseInt(req.params.id);
    let result = categories.find(function (category) {
        return category.id === id;
    });
    
    if (result) {
        let body = req.body;
        let keys = Object.keys(body);
        
        for (const key of keys) {
            if (key === 'name') {
                result[key] = body[key];
                // Tự động cập nhật slug khi name thay đổi
                result.slug = slugify(body[key], {
                    replacement: '-',
                    lower: true,
                    locale: 'vi'
                });
            } else if (result.hasOwnProperty(key) && key !== 'id' && key !== 'creationAt') {
                result[key] = body[key];
            }
        }
        
        result.updatedAt = new Date(Date.now());
        res.status(200).send(result);
    } else {
        res.status(404).send({
            message: "Category ID NOT FOUND"
        });
    }
});

// DELETE - Delete category (soft delete)
// URL: /api/v1/categories/7
router.delete('/:id', function (req, res, next) {
    let id = parseInt(req.params.id);
    let result = categories.find(function (category) {
        return category.id === id;
    });
    
    if (result) {
        result.isDeleted = true;
        result.updatedAt = new Date(Date.now());
        res.status(200).send({
            message: "Category deleted successfully",
            category: result
        });
    } else {
        res.status(404).send({
            message: "Category ID NOT FOUND"
        });
    }
});

module.exports = router;
