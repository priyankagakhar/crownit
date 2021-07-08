This is Api For Guest Services.

It contains 3 Files :-

1) connectionString.js : It contains connection Details of Sql. Please Change host,user,password,database name according to local engine,before testing.

2) GuestDB.sql : Dump File for Sql Database Tables.It has 2 Tables.
A) Venue : Stores Venue Capactiy totalTables and seatsOnTable.
B) GuestList : Stores Guest Info.

3) server.js : It contains endpoints of Api.It has Following EndPoints:

baseurl : http://localhost:2410;

a) To Add Guest Into GuestList :-
Url: baseurl/guest_list/:name
method : POST 
body : {table:int,accompanying_guests:int}
response : {name:string}

b) To Get All Guest In the List :-

Url : baseurl/guest_list 
method : GET
response : {guests:[{name:string,
table:int,
accompanying_guests: int}...]}

c) Update List When Guest Arrive :-

Url : baseurl/guests/:name
method : PUT
body : {accompanying_guests:int}
response : {name:string}

d) Get Arrived Guests : 

Url : basrurl/guests
method : GET
response:  {
guests: [
        {
            name: string,
            time_arrived: string,
            accompanying_guests: int
        }
        ]
    }

 e) Delete Guest From List When Leave : 

 Url : baseurl/guests/name
 method : DELETE
 response : {name:string}

 f) GET Empty Seats:

 Url : baseurl/seats_empty
 method : GET
 response : {
    "empty_seats": int
}

