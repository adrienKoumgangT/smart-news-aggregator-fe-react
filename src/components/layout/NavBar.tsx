import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Avatar,
    Tooltip,
    useTheme,
} from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../../contexts/ThemeContext';
import styles from './NavBar.module.css';
import type {AuthMe} from "../../types/user/AuthMe.ts";
import API from "../../api/axios.ts";


const NavBar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { toggleColorMode } = useThemeContext();

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    // const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const [authMe, setAuthMe] = useState<AuthMe | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        API.get<AuthMe>(`/auth/me`)
            .then((res) => {
                setAuthMe(res.data);
                setIsAdmin(res.data.role === 'admin');

                console.log(authMe);
            })
            .catch((error) => {
                console.log('Error feteching auth me information', error);
            });
    }, []);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    /*const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };*/

    const handleMenuClick = (option: string) => {
        handleCloseUserMenu();
        switch (option) {
            case 'Logout':
                navigate('/login');
                break;
            case 'Profile':
                navigate('/profile');
                break;
            case 'Latest':
                navigate('/latest');
                break;
            case 'Search':
                navigate('/search');
                break;
            case 'History':
                navigate('/history');
                break;
            case 'Comment':
                navigate('/comments');
                break;
            case 'Settings':
                navigate('/settings');
                break;
            case 'Dashboard':
                navigate('/admin/dashboard');
                break;
            default:
                break;
        }
    };

    return (
        <AppBar position="static" color="primary" enableColorOnDark>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div" className={styles.title}>
                    Smart News Aggregator
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    <Tooltip title="Open user menu">
                        <IconButton onClick={handleOpenUserMenu} className={styles.avatarButton}>
                            <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        sx={{ mt: '45px' }}
                        anchorEl={anchorElUser}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {isAdmin && (
                            <MenuItem key={'Dashboard'} onClick={() => handleMenuClick('Dashboard')} className={styles.menuItem}>
                                {'Dashboard'}
                            </MenuItem>
                        )}
                        {['Profile', 'Settings', 'Latest', 'Search', 'History', 'Comment', 'Logout'].map((item) => (
                            <MenuItem key={item} onClick={() => handleMenuClick(item)} className={styles.menuItem}>
                                {item}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;