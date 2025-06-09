import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingRow, setEditingRow] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if user is admin
        checkAdminStatus();
        // Fetch all tables
        fetchTables();
    }, []);

    useEffect(() => {
        checkAdminStatus();
    }, [checkAdminStatus]);

    const checkAdminStatus = async () => {
        try {
            const response = await fetch('http://localhost:3030/api/check-admin', {
                credentials: 'include'
            });
            const data = await response.json();
            if (!data.isAdmin) {
                navigate('/signin');
            } else {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            navigate('/signin');
        }
    };

    const fetchTables = async () => {
        try {
            const response = await fetch('http://localhost:3030/api/admin/tables', {
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setTables(data.tables);
            } else {
                setError(data.error || 'Failed to fetch tables');
            }
        } catch (error) {
            setError('Error fetching tables');
        } finally {
            setLoading(false);
        }
    };

    const fetchTableData = async (tableName) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3030/api/admin/tables/${tableName}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setTableData(data.rows);
            } else {
                setError(data.error || 'Failed to fetch table data');
            }
        } catch (error) {
            setError('Error fetching table data');
        } finally {
            setLoading(false);
        }
    };

    const handleTableSelect = (tableName) => {
        setSelectedTable(tableName);
        fetchTableData(tableName);
    };

    const handleEdit = (row) => {
        setEditingRow(row.id);
        setEditForm(row);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3030/api/admin/tables/${selectedTable}/${editingRow}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(editForm)
            });

            const data = await response.json();
            if (response.ok) {
                // Refresh table data
                fetchTableData(selectedTable);
                setEditingRow(null);
            } else {
                setError(data.error || 'Failed to update row');
            }
        } catch (error) {
            setError('Error updating row');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this row?')) {
            try {
                const response = await fetch(`http://localhost:3030/api/admin/tables/${selectedTable}/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const data = await response.json();
                if (response.ok) {
                    // Refresh table data
                    fetchTableData(selectedTable);
                } else {
                    setError(data.error || 'Failed to delete row');
                }
            } catch (error) {
                setError('Error deleting row');
            }
        }
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            
            {error && <div className="error-message">{error}</div>}

            <div className="tables-list">
                <h2>Select Table</h2>
                <select 
                    value={selectedTable} 
                    onChange={(e) => handleTableSelect(e.target.value)}
                    className="table-select"
                >
                    <option value="">Select a table</option>
                    {tables.map(table => (
                        <option key={table} value={table}>{table}</option>
                    ))}
                </select>
            </div>

            {selectedTable && (
                <div className="table-container">
                    <h2>{selectedTable}</h2>
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        {tableData.length > 0 && 
                                            Object.keys(tableData[0]).map(key => (
                                                <th key={key}>{key}</th>
                                            ))
                                        }
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map(row => (
                                        <tr key={row.id}>
                                            {Object.entries(row).map(([key, value]) => (
                                                <td key={key}>
                                                    {editingRow === row.id ? (
                                                        <input
                                                            type="text"
                                                            name={key}
                                                            value={editForm[key] || ''}
                                                            onChange={handleEditChange}
                                                            disabled={key === 'id'}
                                                        />
                                                    ) : (
                                                        value
                                                    )}
                                                </td>
                                            ))}
                                            <td>
                                                {editingRow === row.id ? (
                                                    <button onClick={handleSave} className="save-btn">
                                                        Save
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={() => handleEdit(row)}
                                                            className="edit-btn"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(row.id)}
                                                            className="delete-btn"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;
