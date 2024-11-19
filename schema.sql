create table posts (
  id  int not null auto_increment,
  name VARCHAR(255) COLLATE utf8mb4_bin NOT NULL UNIQUE,
  Content VARCHAR(255) not null,
  liked int default 0,
  modifyTime timestamp Default CURRENT_TIMESTAMP,
  isActive BOOLEAN DEFAULT true,
  primary key(id)
);

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) COLLATE utf8mb4_bin NOT NULL UNIQUE,
  password TEXT NOT NULL,
  PRIMARY KEY (id)
);


INSERT INTO posts (name, Content) VALUES ('allen','first post');


INSERT INTO posts (name, Content) VALUES ('bob','first post');
