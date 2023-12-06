import {
    AppBar,
    Avatar,
    Badge,
    IconButton,
    List,
    ListItem,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Tooltip
} from "@mui/material";
import { Box } from "@mui/system";
import { Link, NavLink } from "react-router-dom";
import { Notifications } from "@mui/icons-material";
import { useState } from "react";
import { useStore } from "../../stores/stores";
import { observer } from 'mobx-react-lite';

const navStyles = {
    color: 'inherit',
    textDecoration: 'none',
    typography: 'h6',
    '&:hover': {
        color: 'grey.500'
    },
    '&.active': {
        color: 'text.secondary'
    }
}

export default observer(function Header() {
    const { userStore, conversationStore } = useStore()
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = async ()=>{
        handleCloseUserMenu()
        conversationStore.clearAllData()
        //socketStore.clearMessages()
        await userStore.logout()
    }


    return (
        <AppBar position='static'>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Box display='flex' alignItems='center'>
                    <Typography style={{ color: 'white' }} variant="h6" component={NavLink}
                        to='/'
                        sx={navStyles}
                    >
                        WeChat
                    </Typography>
                </Box>

                <List sx={{ display: 'flex' }}>
                    <ListItem
                        component={NavLink}
                        to='/login'
                        sx={navStyles}
                    >
                        Login
                    </ListItem>

                    <ListItem
                        component={NavLink}
                        to='/chathome'
                        sx={navStyles}
                    >
                        Chat
                    </ListItem>

                    <ListItem
                        component={NavLink}
                        to='/signup'
                        sx={navStyles}
                    >
                        SignUp
                    </ListItem>

                    <ListItem
                        component={NavLink}
                        to='/error'
                        sx={navStyles}
                    >
                        Error
                    </ListItem>

                    <ListItem
                        component={NavLink}
                        to='/test'
                        sx={navStyles}
                    >
                        simple peer
                    </ListItem>
                </List>


                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/notification' size='large' edge='start' color='inherit' sx={{ mr: 2 }}>
                        <Badge badgeContent={5} color="secondary">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    <div>
                        <Tooltip title={userStore.user?.displayName}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={userStore.user?.displayName} src={userStore.user?.picture || './assets/user.png'} />
                            </IconButton>
                        </Tooltip>

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>My account</MenuItem>
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </div>

                </Box>
            </Toolbar>
        </AppBar>
    )
})