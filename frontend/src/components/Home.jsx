import React from 'react';
import './home.css';
// import {useGlobalState} from './../../context/GlobalContext';

export default function Home() {

    // const globalState = useGlobalState();

    return (
        <div>
            
            <h1 className="align">Welcome to Zaryab Sweet Shop</h1>
           <div className="alig"> 
           <p >I have made two types of registrations : 
                <br/>
                1- As Admin (if you are admin you can "creat,read,update,delete" products, )
                <br/>
                2- As User
                <br/>
                if u want to see features in admin dashboard you can login as admin:
                <br/>
                email: admin@gmail.com
                <br/>
                password: 1111
                </p>
                </div>
            {/* {JSON.stringify(globalState)} */}
        </div>
    )
}
