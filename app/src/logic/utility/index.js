class Utility{
    static checkEmail(email){
        const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return emailPattern.test(email);
    }
        
    static checkPassword(password){
        if (password.length < 6) {
            return false;
        }
        let strength = 1;
        if (password.length >= 8){
            strength += 1;
        }
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){
            strength += 2;
        }
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)){
            strength += 3;
        }
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)){
            strength += 3;
        }
        if (password.length > 12){
            strength += 1;
        }
        return ( strength>=3 );
    }
    
    static getNum(num){
        if(num === null || num === undefined){
            return null;
        }
        const int = Number.parseInt(num);
        return ( isNaN(int) ? null : int );
    }
}

module.exports = Utility;