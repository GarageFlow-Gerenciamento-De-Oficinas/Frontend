import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout/DashboardLayout";
import { navigationItems } from "../../HomePage/mocks";
import { getUsers } from "../../../services/usersService";
import type { User } from "../../../types/user";

function UsersList() {
    const [userList, setUserList] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true)
            setError('')
            try {
                const data = await getUsers()
                setUserList(data)
            } catch (error) {
                setError(
                    error instanceof Error ? error.message : "Ocorreu um erro inesperado ao carregar os usuários.",
                )
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsers()
    }, [])

    return (
        <DashboardLayout navigationItems={navigationItems}>
            {isLoading && (
                <p role="alert">
                    carregando...
                </p>
            )}
            {error && (
                <p role="alert">
                    {error}
                </p>
            )}
            {userList.map(user => <p key={user.id}>{JSON.stringify(user)}</p>)}
        </DashboardLayout>
    )
}

export default UsersList