select book_id, book_name, book.author_name 
from book, author
where book.author_name = author.author_name
and category = "경제"
order by published_date