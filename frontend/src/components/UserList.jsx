import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, selectUser, setPage, setSearchQuery } from '../redux/usersSlice'

import '../styles/UserList.css'

const UserList = () => {
  const dispatch = useDispatch()
  const { list, currentPage, usersPerPage, totalUsers, status, searchQuery } = useSelector(
    (state) => state.users
  )

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: usersPerPage }))
  }, [dispatch, currentPage, usersPerPage])

  if (status === 'loading') return <p>Загрузка...</p>
  if (status === 'failed') return <p>Ошибка загрузки пользователей</p>

  const totalPages = Math.ceil(totalUsers / usersPerPage)

  const filteredUsers = list.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="user-list">
      <h2>Список пользователей</h2>

      <input
        type="text"
        placeholder="Поиск по имени..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="search-input"
      />

      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <div key={user.id} onClick={() => dispatch(selectUser(user.id))} className="user-item">
            {user.name}
          </div>
        ))
      ) : (
        <p className="no-results">Ничего не найдено</p>
      )}

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => dispatch(setPage(currentPage - 1))}>
          ⬅ Предыдущая
        </button>
        <span>
          Страница {currentPage} из {totalPages}
        </span>
        <button disabled={currentPage === totalPages} onClick={() => dispatch(setPage(currentPage + 1))}>
          Следующая ➡
        </button>
      </div>
    </div>
  )
}

export default UserList