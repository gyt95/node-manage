/*
 * @Author: gyt95.kwan 
 * @Date: 2018-08-16 23:39:50 
 * @Last Modified by: gyt95.kwan
 * @Last Modified time: 2018-08-16 23:40:14
 */

// 爬取游戏基本信息
const request = require('request')
const cheerio = require('cheerio')
const mysql = require('mysql')
// 创建数据库连接
let db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: '123456',
    database: 'spider_test'
});
db.connect()

function show(page){
    let url = `http://a.9game.cn/tpl/android_new/newgame2/xykaice_ajax.html?beginIndex=${page}&count=1&isajax=1`
    console.log(url)
    request(url, function(err, res){
        if(err) console.log('请求出错')
        else{
            var $ = cheerio.load(res.body, { decodeEntities: false})
            $('.game-list-item').each(function(){
                $main = $(this).find('.game-main')
                
                var game_id = $(this).data('game-id')
                var name = $main.find('.game-name').text()
                var image = $(this).find('.game-img-href img').attr('src')
                var type = $main.find('.game-mid .game-text').first().text()
                var size = $main.find('.game-mid .game-text').last().text()
                var time = $main.find('.game-kc').text().substring(0, $main.find('.game-kc').text().lastIndexOf(' '))
                var desc = $main.find('.game-desc').last().text()
                var status = $main.find('.game-kc').text().substr($main.find('.game-kc').text().lastIndexOf(' '))

                // console.log(game_id, name, type, size, time, desc)

                var addSql = "insert into game_list(game_id,name,image,type,size,time,summary,status) values (?,?,?,?,?,?,?,?)";
                var addParams = [game_id, name, image, type, size, time, desc, status]

                if(page > 5){
                    db.end()
                    console.log(name)
                    return; 
                }
                db.query(addSql, addParams, function(err, data){
                    if(err){
                        console.log(err)
                        console.log('数据库连接错误')
                    }else{
                        page++;
                        if(page <= 4){
                            show(page)
                        }else{
                            // db.end()
                            console.log('爬取结束...')
                        }
                    }
                })
            })
        }
    })
}

// for(let i = 2; i <= 5; i++){
    show(2)
// }