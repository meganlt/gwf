import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Profile(){
    const user = useStore((store) => store.user);

  return (
    <>
        <div>
            <h1 className='text-4xl text-center'>Profile</h1>
        </div>
        <div className='profile-header text-center'>
            <img src="avatar-mouse.png" className='mx-auto'/>
            <a href="#">Edit Profile</a>
            <h2 className='text-4xl'>{user.first_name}</h2>
            <p>{user.gender_identity} | {user.pronouns}</p>
        </div>
        <div className='profile-settings'>
            <h2 className='text-3xl'>Account Settings</h2>
        <h3>Email</h3>
            <p>{user.username} <a href="#">edit icon</a></p>
            <h3>AI Personality</h3>
            <p>
                { user.personality_on ? (
                    <strong>toggle is on</strong>
                ) : (
                    <strong>toggle is off</strong>
                )
                }
            </p>    
        </div>
        <div className='edit-profile'>
            <p>to do: put in dialog</p>
            <h2 className='text-3xl'>Edit Profile</h2>
            <a href="#">change avatar</a>
            <h3>First Name</h3>
            <Input type="email" placeholder={user.first_name}/>
            <h3>Last Name</h3>
            <Input type="email" placeholder={user.last_name}/>
            <h3>Pronouns</h3>
            <select>
                <option>She/Her</option>
                <option>He/Him</option>
                <option>They/Them</option>
                <option>Ze/Zir</option>
                <option>Xe/Xem</option>
                <option>It/Its</option>
                <option>Name only</option>
            </select>
        </div>
        
    </>
  )
}

export default Profile;