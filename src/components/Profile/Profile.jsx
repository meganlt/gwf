import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Profile(){
    const user = useStore((store) => store.user);

  return (
    <>
        {/* <div>
            <h1 className='text-4xl text-center'>Profile</h1>
        </div> */}

    <div className="bg-pink-global">
        <h2 className='text-3xl text-center text-pink-global font-semibold'>Account Settings</h2>
        <div className="flex items-center gap-4">
            <img 
                src={user.avatar && user.avatar.trim() !== "" 
                    ? user.avatar 
                    : "/avatar-mouse.png"}
                alt="Your avatar image" 
                className='w-16 h-16'
            />
            <div className="flex flex-col">
                <h2 className='text-2xl font-medium'>{user.first_name}</h2>
                <p className='font-medium'>{user.gender_identity} | {user.pronouns}</p>
                <a href="#">Edit Profile</a>
            </div>
        </div>
    </div>
        <div className='profile-settings'>
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