select 도서ID, 도서명, 도서.작가명 
from 도서, 작가
where 도서.작가명 = 작가.작가명