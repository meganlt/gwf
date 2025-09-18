import { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from "clsx";
import useStore from '../../zustand/store';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Profile(){
    const user = useStore((store) => store.user);
    const fetchUser = useStore((state) => state.fetchUser);
    const [first_name, setFirstName] = useState(user.first_name);
    const [last_name, setLastName] = useState(user.last_name);
    const [pronouns, setPronouns] = useState(user.pronouns);
    const [gender_identity, setGenderIdentity] = useState(user.gender_identity);
    const [dianaPersonalityOn, setDianaPersonalityOn] = useState(user.personality_on);
    const [avatar, setAvatar] = useState(user.avatar);
    const [username, setUsername] = useState(user.username);

    const genderOptions = ["Girl/Woman", "Boy/Man", "Non-binary", "Genderfluid", "Agender", "Intersex", "Bigender", "Prefer not to say"];
    const pnOptions = [ "She/Her", "He/Him", "They/Them", "Ze/Zir", "Xe/Xem", "It/Its"];
    const avatarOptions = [
        "/avatar-alien.png",
        "/avatar-clown.png",
        "/avatar-mime.png",
        "/avatar-mouse.png",
        "/avatar-super.png",
        "/avatar-unicorn.png",
        "/avatar-woman1.png",
        "/avatar-woman2.png",
        "/avatar-woman3.png",
    ]

    console.log('user info from store:', user);

    const updateProfile = async (e) => {
        console.log('in updateProfile function', e);

        const updatedInfo = {
            first_name,
            last_name,
            pronouns,
            gender_identity,
            dianaPersonalityOn,
            avatar,
            username
        }

        try {
            await axios.put('/api/user/update', updatedInfo, { withCredentials: true });
            alert('Account updated successfully!');
            fetchUser();
            } catch (error) {
            console.error('Error updating account:', error);
            alert('Failed to update account. Please try again later.');
        }
    }

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
            <div className="grid grid-cols-3 gap-4 justify-items-center">
            {avatarOptions.map((avatarOption) => (
                <button
                key={avatarOption}
                onClick={() => setAvatar(avatarOption)}
                className={clsx(
                    "text-4xl p-2 rounded-full border transition",
                    avatar === avatarOption ? "border-blue-500" : "border-gray-300"
                )}
                >
                <img
                    src={avatarOption}
                    alt="Avatar"
                    className="w-16 h-16"
                    />
                </button>
            ))}
            </div>
            <h3>First Name</h3>
            <Input type="text" placeholder={user.first_name} onChange={(e) => setFirstName(e.target.value)}/>
            <h3>Last Name</h3>
            <Input type="text" placeholder={user.last_name} onChange={(e) => setLastName(e.target.value)}/>
            <h3>Pronouns</h3>
            <Select defaultValue={pronouns} onValueChange={(value) => setPronouns(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="select your pronouns" />
                </SelectTrigger>
                <SelectContent>
                    {pnOptions.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <h3>Gender Identity</h3>
            <Select defaultValue={gender_identity} onValueChange={(value) => setGenderIdentity(value)}>
                <SelectTrigger>
                    <SelectValue placeholder={gender_identity} />
                </SelectTrigger>
                <SelectContent>
                    {genderOptions.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={updateProfile}>Confirm</Button>
        </div>
        
    </>
  )
}

export default Profile;