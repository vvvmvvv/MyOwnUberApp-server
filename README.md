# MyOwnUberApp-server by Volodymyr Mikulin
(without UI)
## Connect to Database: --(NoSQL database - MongoDB)

### Create .env file with parametrs
```
DB_CONNECT = <mongoUri>
TOKEN_SECRET = <secret_example>
```
## To start :
```
npm install
npm start
```

## To test :
``
Download Postman and do correct requests and get correct responses =)
``
#

## App functionality: --(NodeJs, Express)
```
Authorization with JWT(jsonwebtoken)
Validation with @hapi/joi

Driver is able to register in the system;
Driver is able to login into the system;
Driver is able to view his profile info;
Driver is able to change his account password;
Driver is able to add trucks;
Driver is able to view created trucks;
Driver is able to assign truck to himself;
Driver is able to update not assigned to him trucks info;
Driver is able to delete not assigned to him trucks;
Driver is able to view assigned to him load;
Driver is able to interact with assigned to him load;
Shipper is able to register in the system;
Shipper is able to login into the system;
Shipper is able to view his profile info;
Shipper is able to change his account password;
Shipper is able to delete his account;
Shipper is able to create loads in the system;
Shipper is able to view created loads;
Shipper is able to update loads with status ‘NEW';
Shipper is able to delete loads with status 'NEW';
Shipper is able to post a load;
Shipper is able to view shipping info;

```

### Some information:

```
API documentation uploaded to repository (created by apidoc)
Project logic distributed across different directories and files in simple and easy-to-understand structure;

```
#

## Work with MERN STACK:
### Link to repo with react client app(react-hooks) for this backend: https://github.com/vvvmvvv/MyOwnUber-app
```
App Fuctionality:
1.You can Login & Register & Logout
2.You can open profile information
3.You can change name & password 
4.IF you shipper you can delete your profile
5.All CRUD operations with entity(loads, but trucks not ready)
6.Searching
```
