import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext/useAuth";
import { useNavigate } from "react-router";
import "./userMenu.scss";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";


function UserMenu () {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        if (!isMenuOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current && 
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        }
    }, [isMenuOpen]);

    async function handleLogout() {
        setIsMenuOpen(false);

        try {
            await logout();
        } finally {
            navigate("/login", {replace: true});
        }
    }

    return (
        <div
            className="dashboard-header__profile-container"
            ref={menuRef}
        >
            <button
                type="button"
                className="dashboard-header__profile"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsMenuOpen((previous) => !previous)}
            >
                <span className="dashboard-header__avatar">JS</span>

                <div className="dashboard-header__profile-info">
                    <strong>João Silva</strong>
                    <span>Administrador</span>
                </div>

                <ChevronDown
                    size={16}
                    className={`dashboard-header__chevron ${
                        isMenuOpen ? "is-open" : ""
                    }`}
                />
            </button>

            {isMenuOpen && (
                <div
                    className="dashboard-header__dropdown"
                    role="menu"
                >
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <UserRound size={17} />
                        <span>Meu perfil</span>
                    </button>

                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Settings size={17} />
                        <span>Configurações</span>
                    </button>

                    <div className="dashboard-header__dropdown-divider" />

                    <button
                        type="button"
                        role="menuitem"
                        className="dashboard-header__logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={17} />
                        <span>Sair da conta</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserMenu