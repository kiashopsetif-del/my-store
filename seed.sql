-- ============================================================
--  بيانات التهيئة الأولية لمتجر NOIR
--  يُشغَّل بعد إنشاء الجداول: npx drizzle-kit push
--  psql postgresql://postgres:postgres@127.0.0.1:5432/app_db -f seed.sql
-- ============================================================

-- ---------- الإعدادات (صف واحد) ----------
INSERT INTO settings (id, store_name, logo_text, tagline, accent_color, currency, hero_image, promo_image, about_image)
VALUES (
  1,
  'NOIR',
  'N',
  'الفخامة بأسلوب جديد',
  '#d4af37',
  'ر.س',
  '/images/hero.jpg',
  'https://images.pexels.com/photos/3756912/pexels-photo-3756912.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/8125854/pexels-photo-8125854.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
)
ON CONFLICT (id) DO NOTHING;

-- ---------- الأقسام ----------
INSERT INTO categories (name, slug, description, image, sort_order, active) VALUES
('الساعات',  'watches',  'ساعات فاخرة تجمع الدقة والأناقة',           'https://images.pexels.com/photos/13273983/pexels-photo-13273983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 1, true),
('السماعات', 'audio',    'سماعات عالية الجودة لنقاء الصوت',           'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',  2, true),
('العطور',   'perfume',  'عطور فاخرة تدوم طويلاً',                    'https://images.pexels.com/photos/16125025/pexels-photo-16125025.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 3, true),
('الأحذية',  'sneakers', 'أحذية رياضية أنيقة ومريحة',                 'https://images.pexels.com/photos/27988921/pexels-photo-27988921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 4, true),
('الحقائب',  'bags',     'حقائب جلدية بتصاميم خالدة',                 'https://images.pexels.com/photos/12877069/pexels-photo-12877069.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- ---------- المنتجات ----------
INSERT INTO products (name, slug, description, price, compare_at_price, image, category_id, stock, featured, active, rating, badge) VALUES
-- ساعات
('ساعة NOIR الذهبية', 'gold-watch', 'ساعة يد فاخرة بإطار ذهبي ومينا أسود، حركة دقيقة وسوار جلدي يبعث على الفخامة.', 2499, 3200, 'https://images.pexels.com/photos/13273983/pexels-photo-13273983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='watches'), 12, true, true, 4.9, 'الأكثر مبيعاً'),
('ساعة كرونوغراف كلاسيك', 'chrono-classic', 'كرونوغراف رياضي أنيق بسوار جلد بني ومينا مفصّلة تلفت الأنظار.', 1899, 2400, 'https://images.pexels.com/photos/13273980/pexels-photo-13273980.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='watches'), 8, true, true, 4.7, NULL),
('ساعة سوار جلد بني', 'leather-watch', 'تصميم خالد بسوار جلدي طبيعي ومينا نحيف يناسب كل الإطلالات اليومية والرسمية.', 1299, NULL, 'https://images.pexels.com/photos/13273982/pexels-photo-13273982.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='watches'), 15, false, true, 4.6, NULL),
-- سماعات
('سماعات NOIR اللاسلكية', 'noir-headphones', 'سماعات رأس لاسلكية بخاصية عزل الضوضاء وصوت نقي وعمر بطارية يصل إلى 40 ساعة.', 899, 1199, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='audio'), 20, true, true, 4.8, 'جديد'),
('سماعات استوديو احترافية', 'studio-headphones', 'سماعات استوديو بجودة صوت استثنائية وتصميم مريح للاستخدام الطويل.', 649, NULL, 'https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='audio'), 18, false, true, 4.7, NULL),
('سماعات مع علبة شحن', 'headphones-case', 'سماعات لاسلكية أنيقة مع علبة شحن وحماية كاملة أثناء التنقل.', 449, 599, 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='audio'), 25, false, true, 4.5, NULL),
-- عطور
('عطر NOIR الفاخر', 'noir-perfume', 'عطر شرقي فاخر بروائح العود والمسك يدوم طوال اليوم ويترك أثراً لا يُنسى.', 599, 750, 'https://images.pexels.com/photos/16125025/pexels-photo-16125025.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='perfume'), 30, true, true, 4.9, 'حصري'),
('مجموعة عطور فاخرة', 'perfume-set', 'تشكيلة عطور راقية بروائح متنوعة تناسب كل المناسبات والمناسبات الخاصة.', 1299, NULL, 'https://images.pexels.com/photos/30999189/pexels-photo-30999189.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='perfume'), 10, false, true, 4.7, NULL),
('عطر زجاجي أنيق', 'elegant-perfume', 'عطر منعش بنفحات الزهور والحمضيات في زجاجة أنيقة تصلح هدية راقية.', 399, 520, 'https://images.pexels.com/photos/28406043/pexels-photo-28406043.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='perfume'), 22, false, true, 4.6, NULL),
-- أحذية
('حذاء رياضي أسود', 'black-sneakers', 'حذاء رياضي عصري بلون أسود كلاسيكي ونعل مريح يدوم طويلاً.', 549, 699, 'https://images.pexels.com/photos/27988921/pexels-photo-27988921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='sneakers'), 16, true, true, 4.7, NULL),
('حذاء رياضي فضي', 'silver-sneakers', 'تصميم جريء بلون فضي لامع يضيف لمسة عصرية مميزة لإطلالتك.', 629, NULL, 'https://images.pexels.com/photos/27988923/pexels-photo-27988923.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='sneakers'), 9, false, true, 4.5, NULL),
('حذاء إصدار محدود', 'limited-sneakers', 'حذاء بإصدار محدود نادر بتصميم مميز يجمعه هواة الأناقة حول العالم.', 1199, 1499, 'https://images.pexels.com/photos/16923479/pexels-photo-16923479.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='sneakers'), 5, false, true, 4.8, 'إصدار محدود'),
-- حقائب
('حقيبة جلدية بنية', 'brown-bag', 'حقيبة يد جلدية فاخرة بلون بني كلاسيكي بمساحة واسعة وتفاصيل دقيقة.', 899, 1100, 'https://images.pexels.com/photos/12877069/pexels-photo-12877069.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='bags'), 14, true, true, 4.8, NULL),
('حقيبة يد فاخرة', 'designer-bag', 'حقيبة عصرية بتصميم أنيق يناسب الإطلالات اليومية والرسمية.', 749, NULL, 'https://images.pexels.com/photos/13025817/pexels-photo-13025817.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='bags'), 11, false, true, 4.6, NULL),
('حقيبة بنقشة ذهبية', 'gold-pattern-bag', 'حقيبة مميزة بنقشة ذهبية فاخرة تضيف لمسة من الرقي على إطلالتك.', 999, 1250, 'https://images.pexels.com/photos/8125851/pexels-photo-8125851.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', (SELECT id FROM categories WHERE slug='bags'), 7, false, true, 4.7, NULL)
ON CONFLICT (slug) DO NOTHING;

-- ---------- بطاقات المميزات ----------
INSERT INTO features (title, description, icon, sort_order, active) VALUES
('شحن سريع وآمن', 'توصيل لكل المدن خلال 2 إلى 4 أيام عمل.', '🚚', 1, true),
('إرجاع خلال 14 يوم', 'استرجاع سهل وسريع خلال 14 يوماً من الاستلام.', '↩', 2, true),
('دفع عند الاستلام', 'ادفع نقداً عند استلام طلبك بكل أمان وراحة.', '💵', 3, true),
('ضمان الجودة', 'منتجات أصلية مضمونة الجودة 100%.', '✦', 4, true)
ON CONFLICT DO NOTHING;
