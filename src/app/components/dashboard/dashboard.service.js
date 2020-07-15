function DashboardService() {
    this.defaultContacts = [
        {
            "name": "Anil Vishvkarma",
            "email": "anil.vishvkarma@gmail.com",
            "mobile": "971344864",
            "company": "Software Developer",
            "gender": "male"
        },
        {
            "name": "Akshay Soni",
            "email": "akshay.soni@gmail.com",
            "mobile": "9753632727",
            "company": "Limited",
            "gender": "male"
        },
        {
            "name": "Elyse Hobson",
            "email": "elyse.hobson@gmail.com",
            "mobile": "971344864",
            "company": "Technology",
            "gender": "female"
        },
        {
            "name": "Deepak Ahirwal",
            "email": "deepak.ahirwal@cg.com",
            "mobile": "971344864",
            "company": "Technology.",
            "gender": "male"
        }
    ];

    this.getDefaultContacts = function () {
        return this.defaultContacts;
    }

    this.setNewContact = function (newContact) {
        this.defaultContacts.push(newContact);
    }
}

angular.module('root').service('DashboardService', DashboardService);
