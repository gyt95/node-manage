const mysql = require('mysql');
const config = require('../config/default.js');
const pool = mysql.createPool({
  host: config.HOST,
  user: config.USERNAME,
  password: config.PASSWORD,
  database: config.DATABASE
});

let query = function (sql, values) {

  return new Promise((resolve, reject) => {

    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

users =
  `create table if not exists users(
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(100) NOT NULL,
 pswd VARCHAR(40) NOT NULL,
 nickname VARCHAR(255),
 sex VARCHAR(10),
 birthplace VARCHAR(100),
 signature VARCHAR(255),
 create_at VARCHAR(100) NOT NULL,
 status INT NOT NULL,
 PRIMARY KEY ( id )
);`

posts =
  `create table if not exists posts(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    content VARCHAR(255) NOT NULL,
    create_at VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY ( id )
  );`

let createTable = sql => {
  return query(sql, [])
}

// 建表
createTable(users)
createTable(posts)

// 注册用户
let insertData = value => {
  let _sql = "insert into users(name,pswd,status,create_at) values(?,?,?,?);"
  return query(_sql, value)
}

// 通过名字查找用户
let findDataByName = name => {
  let _sql = `
      select * from users
        where name="${name}"
        `
  return query(_sql)
}

// 发表个人动态
let insertPost = value => {
  console.log(value)
  let _sql = "insert into posts(name,content,create_at,user_id) value(?, ?, ?, ?);"
  return query(_sql, value)
}

// 获取某用户所有动态
let findPostsById = user_id => {
  let _sql = `select * from posts where user_id="${user_id}"`
  return query(_sql)
}

// 删除个人动态


/**后台管理部分**/

// 查找所有用户
// let findAllName = name => {
//   let _sql = "SELECT * from users"
//   return query(_sql)
// }

// // 删除用户
// let deleteUserData = function (name) {
//   let _sql = `delete from users where name="${name}";`
//   return query(_sql)
// }

module.exports = {
  query,
  createTable,
  insertData,
  findDataByName,
  insertPost,
  findPostsById
}