import { TextField, debounce } from "@mui/material";
import { useState } from "react";
import { IUser } from "../../models/user";
import agent from "../../api/agent";

interface Props {
    callbackContact: (data: IUser[]) => void;
}

export default function SidebarHeader({ callbackContact }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    // const debouncedSearch = debounce((event: any) => {

    // }, 1000)

    async function searchHanlder(event: any) {
        if (event.target.value !== '' && event.key === "Enter") {
            const data = await agent.User.searchUser(event.target.value)
            if (data) callbackContact(data)
        }
    }

    return (
        <TextField
            id="outlined-basic"
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm || ''}
            onChange={(event: any) => {
                setSearchTerm(event.target.value);
            }}
            onKeyDown={(e) => searchHanlder(e)}
        />
    )
}