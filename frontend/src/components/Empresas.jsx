import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Building } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/empresas';

export default function Empresas() {
    const { token, user } = useAuth();
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ id: '', nombre: '', direccion: '', telefono: '' });

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const fetchEmpresas = async () => {
        try {
            const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
            setEmpresas(res.data?.data || []);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error fetching data');
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { ...formData, id: Number(formData.id) };

            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, payload, config);
            } else {
                await axios.post(API_URL, payload, config);
            }
            setShowModal(false);
            setEditingId(null);
            fetchEmpresas();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error saving data');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this empresa?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchEmpresas();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error deleting data');
        }
    };

    const openEditModal = (empresa) => {
        setFormData({ id: empresa.id, nombre: empresa.nombre, direccion: empresa.direccion, telefono: empresa.telefono });
        setEditingId(empresa.id);
        setShowModal(true);
    };

    const openCreateModal = () => {
        setFormData({ id: '', nombre: '', direccion: '', telefono: '' });
        setEditingId(null);
        setShowModal(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building size={24} color="var(--clr-primary)" /> Empresas</h2>
                    <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>Gestión de empresas registradas</p>
                </div>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={openCreateModal}>
                        <Plus size={18} /> Nueva Empresa
                    </button>
                )}
            </div>

            {loading ? (
                <p>Cargando datos...</p>
            ) : error ? (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--clr-danger)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>{error}</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {empresas.map((emp) => (
                        <div key={emp._id} style={{ background: 'var(--clr-bg-elevated)', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative' }}>
                            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>ID: {emp.id}</span>
                                <h3 style={{ margin: '0.25rem 0', color: 'white', fontSize: '1.1rem' }}>{emp.nombre}</h3>
                            </div>
                            <div style={{ paddingTop: '1rem', color: 'var(--clr-text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div><strong>Dirección:</strong> {emp.direccion}</div>
                                <div><strong>Teléfono:</strong> {emp.telefono}</div>
                            </div>

                            {isAdmin && (
                                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-icon" onClick={() => openEditModal(emp)}><Edit2 size={16} /></button>
                                    <button className="btn-icon" style={{color: 'var(--clr-danger)'}} onClick={() => handleDelete(emp.id)}><Trash2 size={16} /></button>
                                </div>
                            )}
                        </div>
                    ))}
                    {empresas.length === 0 && <p style={{ color: 'var(--clr-text-muted)' }}>No hay empresas registradas.</p>}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div className="glass-panel animate-enter" style={{ width: '100%', maxWidth: '400px' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{editingId ? 'Editar Empresa' : 'Nueva Empresa'}</h3>
                        <form onSubmit={handleSave}>
                            <input className="input-field" type="number" placeholder="ID Numérico" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} required disabled={!!editingId} />
                            <input className="input-field" type="text" placeholder="Nombre (solo letras)" pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                            <input className="input-field" type="text" placeholder="Dirección" value={formData.direccion} onChange={e => setFormData({ ...formData, direccion: e.target.value })} required />
                            <input className="input-field" type="text" placeholder="Teléfono" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} required />
                            
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--clr-bg-elevated)', color: 'var(--clr-text-main)' }} onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
