import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();



const findEmail = (email) => {
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT * FROM users WHERE email='${email}'`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}
const create = (data)=>{
    console.log(id,username,email,passwordHash,role,avatar_url) = data
    return  new Promise ((resolve,reject)=> 
        Pool.query(`INSERT INTO users(id, username, email, password, role, avatar_url) VALUES('${id}','${username}','${email}','${passwordHash}','${role}','${avatar_url}')`,(error,result)=>{
            if(!error){
                resolve(result)
            }else{
                reject(error)
            }
        })
    )
}
const findID = (data) => {
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT * FROM users WHERE id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}
const gettAllUsers = (data) => {
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT * FROM users`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}
const updateByID = (id, data) => {
    const { username, email, passwordHash, role, avatar_url } = data;
    return new Promise((resolve, reject) =>
        Pool.query(`UPDATE users SET username='${username}', email='${email}', password='${passwordHash}', role='${role}', avatar_url='${avatar_url}' WHERE id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        }) 
    )           
}

const deleteByID = (id) => {
    return new Promise((resolve, reject) =>
        Pool.query(`DELETE FROM users WHERE id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}
    
export { findEmail, create, findID, gettAllUsers, updateByID, deleteByID};