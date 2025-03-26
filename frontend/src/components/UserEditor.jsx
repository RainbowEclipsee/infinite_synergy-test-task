import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, updateUserOnServer } from '../redux/usersSlice'

import '../styles/UserEditor.css'

const UserEditor = () => {
  const dispatch = useDispatch()
  const selectedUser = useSelector((state) => state.users.selectedUser)
  const isSaving = useSelector((state) => state.users.isSaving)

  const [formData, setFormData] = useState({
    id: '',
    jobTitle: '',
    department: '',
    company: '',
  })

  useEffect(() => {
    if (selectedUser) {
      setFormData(selectedUser)
    }
  }, [selectedUser])

  if (!selectedUser)
    return (
      <div>
        <p className="empty-state">Выберите пользователя</p>
      </div>
    )

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = () => {
    if (!formData.id) return
    dispatch(updateUser(formData))
    dispatch(updateUserOnServer(formData))
  }

  return (
    <div className="user-details">
      <h2>Пользователь {formData.name}</h2>
      <label>
        Должность:
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle || ''}
          onChange={handleChange}
          disabled={isSaving}
        />
      </label>
      <label>
        Отдел:
        <input
          type="text"
          name="department"
          value={formData.department || ''}
          onChange={handleChange}
          disabled={isSaving}
        />
      </label>
      <label>
        Компания:
        <input
          type="text"
          name="company"
          value={formData.company || ''}
          onChange={handleChange}
          disabled={isSaving}
        />
      </label>
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Сохранение...' : 'Сохранить'}
      </button>
    </div>
  )
}

export default UserEditor
