// "use client";

// import React, { useEffect, useState } from 'react';
// import {
//     Typography,
//     Box,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     IconButton,
//     Chip,
//     Button,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     MenuItem,
//     Select,
//     InputLabel,
//     FormControl,
//     SelectChangeEvent
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import { deleteUser, getUsers, registerUser, updateUser } from "@/services/authService";
// import { useSelector } from 'react-redux';
// import { RootState } from '@/lib/store';

// // Define User Interface
// interface User {
//     id: number;
//     name: string;
//     email: string;
//     role: string;
//     status: string;
// }

// export default function UsersPage() {
//     const [users, setUsers] = useState<User[]>([]);

//     // State Management
//     const [openDialog, setOpenDialog] = useState(false);
//     const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//     const [currentUser, setCurrentUser] = useState<User | null>(null); // For Edit
//     const [userToDelete, setUserToDelete] = useState<number | null>(null);
//     const token = useSelector((state: RootState) => state.auth.user?.token);

//     // Form State (could be separate or derived from currentUser)
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         role: '',
//         status: ''
//     });
//     const [loading, setLoading] = useState(false);

//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const data = await getUsers(token);
//             setUsers(data);
//         } catch (error: any) {
//             alert(error.message || "Failed to load users");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     // Handle Open/Close Dialogs
//     const handleOpenDialog = (user?: User) => {
//         if (user) {
//             // Edit Mode
//             setCurrentUser(user);
//             setFormData({
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 status: user.status
//             });
//         } else {
//             // Create Mode
//             setCurrentUser(null);
//             setFormData({
//                 name: '',
//                 email: '',
//                 role: '',
//                 status: ''
//             });
//         }
//         setOpenDialog(true);
//     };

//     const handleCloseDialog = () => {
//         setOpenDialog(false);
//         setCurrentUser(null);
//     };

//     // Handle Form Changes
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSelectChange = (e: SelectChangeEvent) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name as string]: value }));
//     };

//     // Handle Save (Create or Update)
//     const handleSave = async () => {
//         setLoading(true);
//         try {
//             if (currentUser) {
//                 await updateUser(currentUser.id, formData, token);
//             } else {
//                 await registerUser(formData);
//             }

//             await fetchUsers(); // reload from backend after create/update
//             handleCloseDialog();
//         } catch (error: any) {
//             alert(error.message || "Operation failed");
//         } finally {
//             setLoading(false);
//         }

//     };

//     // Handle Delete
//     const handleDeleteClick = (id: number) => {
//         setUserToDelete(id);
//         setOpenDeleteDialog(true);
//     };

//     const handleConfirmDelete = async () => {
//         if (userToDelete === null) return;

//         setLoading(true);
//         try {
//             await deleteUser(userToDelete, token);
//             await fetchUsers(); // refresh table
//             setOpenDeleteDialog(false);
//             setUserToDelete(null);
//         } catch (error: any) {
//             alert(error.message || "Failed to delete user");
//         } finally {
//             setLoading(false);
//         }

//     };

//     return (
//         <Box>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//                 <Typography variant="h4" fontWeight="bold" color="primary">
//                     Active Users
//                 </Typography>
//                 <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={() => handleOpenDialog()}
//                 >
//                     Add User
//                 </Button>
//             </Box>

//             <Paper sx={{ mt: 3, overflow: 'hidden' }}>
//                 <TableContainer>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Name</TableCell>
//                                 <TableCell>Email</TableCell>
//                                 <TableCell>Role</TableCell>
//                                 <TableCell>Status</TableCell>
//                                 <TableCell align="right">Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {users.length === 0 ? (
//                                 <TableRow key="no-users">
//                                     <TableCell colSpan={5} align="center">{"No users found."}</TableCell>
//                                 </TableRow>
//                             ) : (
//                                 users.map((user, index) => (
//                                     // Use a combination of id and index to guarantee a unique key
//                                     <TableRow key={`${user.id}-${index}`} hover>
//                                         <TableCell>{user.name}</TableCell>
//                                         <TableCell>{user.email}</TableCell>
//                                         <TableCell>{user.role}</TableCell>
//                                         <TableCell>
//                                             <Chip
//                                                 label={user.status}
//                                                 color={user.status === 'Active' ? 'success' : 'default'}
//                                                 size="small"
//                                                 variant="outlined"
//                                             />
//                                         </TableCell>
//                                         <TableCell align="right">
//                                             <IconButton
//                                                 size="small"
//                                                 color="primary"
//                                                 onClick={() => handleOpenDialog(user)}
//                                             >
//                                                 <EditIcon />
//                                             </IconButton>
//                                             <IconButton
//                                                 size="small"
//                                                 color="error"
//                                                 onClick={() => handleDeleteClick(user.id)}
//                                             >
//                                                 <DeleteIcon />
//                                             </IconButton>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             )}
//                         </TableBody>




//                     </Table>
//                 </TableContainer>
//             </Paper>

//             {/* Create/Edit User Dialog */}
//             <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
//                 <DialogTitle>{currentUser ? 'Edit User' : 'Add New User'}</DialogTitle>
//                 <DialogContent>
//                     <Box component="form" sx={{ mt: 1 }}>
//                         <TextField
//                             margin="normal"
//                             fullWidth
//                             label="Name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                         />
//                         <TextField
//                             margin="normal"
//                             fullWidth
//                             label="Email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleInputChange}
//                         />
//                         <FormControl fullWidth margin="normal">
//                             <InputLabel>Role</InputLabel>
//                             <Select
//                                 name="role"
//                                 value={formData.role}
//                                 label="Role"
//                                 onChange={handleSelectChange}
//                             >
//                                 <MenuItem value="Citizen">Citizen</MenuItem>
//                                 <MenuItem value="Officer">Officer</MenuItem>
//                                 <MenuItem value="Admin">Admin</MenuItem>
//                             </Select>
//                         </FormControl>
//                         <FormControl fullWidth margin="normal">
//                             <InputLabel>Status</InputLabel>
//                             <Select
//                                 name="status"
//                                 value={formData.status}
//                                 label="Status"
//                                 onChange={handleSelectChange}
//                             >
//                                 <MenuItem value="Active">Active</MenuItem>
//                                 <MenuItem value="Inactive">Inactive</MenuItem>
//                                 <MenuItem value="Suspended">Suspended</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Box>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
//                     <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Delete Confirmation Dialog */}
//             <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
//                 <DialogTitle>Confirm Delete</DialogTitle>
//                 <DialogContent>
//                     <Typography>
//                         Are you sure you want to delete this user? This action cannot be undone.
//                     </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">Cancel</Button>
//                     <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// }
"use client";

import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    SelectChangeEvent,
    InputAdornment,
    Snackbar,
    Alert,
    TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { deleteUser, getUsers, registerUser, updateUser } from "@/services/authService";
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

// Define User Interface
interface User {
    id: number;
    fullName: string;
    nic: string;
    username: string;
    email: string;
    role: string;
    status: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const token = useSelector((state: RootState) => state.auth.user?.token);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [formData, setFormData] = useState({
        fullName: '',
        nic: '',
        username: '',
        email: '',
        role: '',
        status: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Snackbar State
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers(token);
            setUsers(data);
        } catch (error: any) {
            alert(error.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Normalize Role and Status
    const normalizeRole = (role: string) => {
        if (!role) return '';
        const formatted = role.toLowerCase();
        if (formatted === 'citizen') return 'Citizen';
        if (formatted === 'officer') return 'Officer';
        if (formatted === 'admin') return 'Admin';
        return '';
    };

    const normalizeStatus = (status: string) => {
        if (!status) return '';
        const formatted = status.toLowerCase();
        if (formatted === 'active') return 'Active';
        if (formatted === 'inactive') return 'Inactive';
        if (formatted === 'suspended') return 'Suspended';
        return '';
    };

    // Open dialog for add/edit
    const handleOpenDialog = (user?: User) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                fullName: user.fullName,
                nic: user.nic,
                username: user.username,
                email: user.email,
                role: normalizeRole(user.role),
                status: normalizeStatus(user.status),
                password: '',
                confirmPassword: ''
            });
        } else {
            setCurrentUser(null);
            setFormData({
                fullName: '',
                nic: '',
                username: '',
                email: '',
                role: '',
                status: '',
                password: '',
                confirmPassword: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentUser(null);
        setFormData({
            fullName: '',
            nic: '',
            username: '',
            email: '',
            role: '',
            status: '',
            password: '',
            confirmPassword: ''
        });
    };

    // Input handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as string]: value }));
    };

    // Save user (add/update)
    const handleSave = async () => {
        if (!currentUser && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            if (currentUser) {
                const updateData: any = { ...formData };
                if (!formData.password) {
                    delete updateData.password;
                    delete updateData.confirmPassword;
                }
                await updateUser(currentUser.id, updateData, token);
            } else {
                await registerUser(formData);
            }
            await fetchUsers();
            handleCloseDialog();
            setSnackbarMessage(currentUser ? "User updated successfully" : "User created successfully");
            setSnackbarOpen(true);
        } catch (error: any) {
            alert(error.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    // Delete handlers
    const handleDeleteClick = (id: number) => {
        setUserToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete === null) return;
        setLoading(true);
        try {
            await deleteUser(userToDelete, token);
            await fetchUsers();
            setOpenDeleteDialog(false);
            setUserToDelete(null);
            setSnackbarMessage("User deleted successfully");
            setSnackbarOpen(true);
        } catch (error: any) {
            alert(error.message || "Failed to delete user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Active Users
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add User
                </Button>
            </Box>

            {/* Users Table */}
            <Paper sx={{ mt: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>NIC</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.length === 0 ? (
                                <TableRow key="no-users">
                                    <TableCell colSpan={7} align="center">No users found.</TableCell>
                                </TableRow>
                            ) : (
                                paginatedUsers.map((user, index) => (
                                    <TableRow key={`${user.id}-${index}`} hover>
                                        <TableCell>{user.fullName}</TableCell>
                                        <TableCell>{user.nic}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{normalizeRole(user.role)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={normalizeStatus(user.status)}
                                                color={normalizeStatus(user.status) === 'Active' ? 'success' : 'default'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleOpenDialog(user)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteClick(user.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Add/Edit User Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{currentUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="NIC"
                            name="nic"
                            value={formData.nic}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {!currentUser && (
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required={!currentUser}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}
                        {!currentUser && (
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required={!currentUser}
                                error={formData.password !== formData.confirmPassword}
                                helperText={formData.password !== formData.confirmPassword ? "Passwords do not match" : ""}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                label="Role"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value="Citizen">Citizen</MenuItem>
                                <MenuItem value="Officer">Officer</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                label="Status"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                                <MenuItem value="Suspended">Suspended</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={10000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
