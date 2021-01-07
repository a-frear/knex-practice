BEGIN;

INSERT INTO shopping_list
    (title, content, date_published)
VALUES
    ('Almonds', 0.99, '2016-01-16 12:00:00', 'False', 'Snack'),
    ('Tuna', 3.99, '2016-01-16 12:00:00', 'False', 'Main'),
    ('Cereal', 4.99, '2016-01-16 12:00:00', 'False', 'Breakfast'),
    ('Bread', 2.99, '2016-01-16 12:00:00', 'False', 'Lunch'),

COMMIT;