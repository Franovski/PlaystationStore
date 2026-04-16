import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { logoutUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { adminSummaryApi, adminUsersApi, adminGamesApi, adminPlatformsApi, adminCategoriesApi, adminGameCategoriesApi, adminGamePlatformsApi } from '../api/adminApi';
import { User, Game, Platform, Category, GameCategory, GamePlatform } from '../types';

type UserFormState = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  dateOfBirth: string;
  role: 'admin' | 'playstation_user';
};

type GameFormState = {
  title: string;
  description: string;
  releaseDate: string;
  basePrice: string;
  developer: string;
  publisher: string;
  ageRating: string;
};

type PlatformFormState = {
  platformName: 'ps4' | 'ps5' | '';
};

type CategoryFormState = {
  categoryName: string;
  description: string;
};

type GameRelationFormState = {
  gameId: string;
  relationId: string;
};

export const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  "Côte d'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

const emptyUserForm: UserFormState = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  country: '',
  dateOfBirth: '',
  role: 'playstation_user',
};

const emptyGameForm: GameFormState = {
  title: '',
  description: '',
  releaseDate: '',
  basePrice: '',
  developer: '',
  publisher: '',
  ageRating: '',
};

const emptyPlatformForm: PlatformFormState = { platformName: '' };
const emptyCategoryForm: CategoryFormState = { categoryName: '', description: '' };
const emptyRelationForm: GameRelationFormState = { gameId: '', relationId: '' };

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'games' | 'platforms' | 'categories' | 'gameCategories' | 'gamePlatforms'>('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    customers: 0,
    games: 0,
    categories: 0,
    platforms: 0,
  });
  const [usersList, setUsersList] = useState<User[]>([]);
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [platformsList, setPlatformsList] = useState<Platform[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [gameCategoriesList, setGameCategoriesList] = useState<GameCategory[]>([]);
  const [gamePlatformsList, setGamePlatformsList] = useState<GamePlatform[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isGameCategoryModalOpen, setIsGameCategoryModalOpen] = useState(false);
  const [isGamePlatformModalOpen, setIsGamePlatformModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingGameCategory, setEditingGameCategory] = useState<GameCategory | null>(null);
  const [editingGamePlatform, setEditingGamePlatform] = useState<GamePlatform | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [userFormData, setUserFormData] = useState<UserFormState>(emptyUserForm);
  const [gameFormData, setGameFormData] = useState<GameFormState>(emptyGameForm);
  const [platformFormData, setPlatformFormData] = useState<PlatformFormState>(emptyPlatformForm);
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormState>(emptyCategoryForm);
  const [relationFormData, setRelationFormData] = useState<GameRelationFormState>(emptyRelationForm);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/user');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setSearchTerm('');

    try {
      if (activeTab === 'dashboard') {
        const summaryRes: any = await adminSummaryApi.getSummary();
        setStats({
          users: summaryRes?.totalUsers || 0,
          admins: summaryRes?.totalAdmins || 0,
          customers: summaryRes?.totalCustomers || 0,
          games: summaryRes?.totalGames || 0,
          categories: summaryRes?.totalCategories || 0,
          platforms: summaryRes?.totalPlatforms || 0,
        });
      } else if (activeTab === 'users') {
        const res: any = await adminUsersApi.getAll();
        setUsersList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'games') {
        const res: any = await adminGamesApi.getAll();
        setGamesList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'platforms') {
        const res: any = await adminPlatformsApi.getAll();
        setPlatformsList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'categories') {
        const res: any = await adminCategoriesApi.getAll();
        setCategoriesList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'gameCategories') {
        const games: any = await adminGamesApi.getAll();
        setGamesList(Array.isArray(games) ? games : []);
        const categories: any = await adminCategoriesApi.getAll();
        setCategoriesList(Array.isArray(categories) ? categories : []);
        try {
          const res: any = await adminGameCategoriesApi.getAll();
          setGameCategoriesList(Array.isArray(res) ? res : []);
        } catch (ignored) { }
      } else if (activeTab === 'gamePlatforms') {
        const games: any = await adminGamesApi.getAll();
        setGamesList(Array.isArray(games) ? games : []);
        const platforms: any = await adminPlatformsApi.getAll();
        setPlatformsList(Array.isArray(platforms) ? platforms : []);
        try {
          const res: any = await adminGamePlatformsApi.getAll();
          setGamePlatformsList(Array.isArray(res) ? res : []);
        } catch (ignored) { }
      }
    } catch (err) {
      console.error(`Failed to load admin data for ${activeTab}`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const openUserModal = (userToEdit: User | null = null) => {
    setEditingUser(userToEdit);

    if (userToEdit) {
      setUserFormData({
        username: userToEdit.username || '',
        email: userToEdit.email || '',
        password: '',
        firstName: userToEdit.firstName || '',
        lastName: userToEdit.lastName || '',
        country: userToEdit.country || '',
        dateOfBirth: userToEdit.dateOfBirth ? String(userToEdit.dateOfBirth).slice(0, 10) : '',
        role: userToEdit.role || 'playstation_user',
      });
    } else {
      setUserFormData(emptyUserForm);
    }

    setIsUserModalOpen(true);
  };

  const openGameModal = (gameToEdit: Game | null = null) => {
    setEditingGame(gameToEdit);

    if (gameToEdit) {
      setGameFormData({
        title: gameToEdit.title || '',
        description: gameToEdit.description || '',
        releaseDate: gameToEdit.releaseDate ? String(gameToEdit.releaseDate).slice(0, 10) : '',
        basePrice:
          gameToEdit.basePrice !== undefined && gameToEdit.basePrice !== null
            ? String(gameToEdit.basePrice)
            : '',
        developer: gameToEdit.developer || '',
        publisher: gameToEdit.publisher || '',
        ageRating: gameToEdit.ageRating || '',
      });
    } else {
      setGameFormData(emptyGameForm);
    }

    setIsGameModalOpen(true);
  };

  const openPlatformModal = (p: Platform | null = null) => {
    setEditingPlatform(p);
    setPlatformFormData(p ? { platformName: p.platformName } : emptyPlatformForm);
    setIsPlatformModalOpen(true);
  };

  const openCategoryModal = (c: Category | null = null) => {
    setEditingCategory(c);
    setCategoryFormData(c ? { categoryName: c.categoryName, description: c.description || '' } : emptyCategoryForm);
    setIsCategoryModalOpen(true);
  };

  const openGameCategoryModal = (gc: GameCategory | null = null) => {
    setEditingGameCategory(gc);
    setRelationFormData(gc ? { gameId: String(gc.gameId), relationId: String(gc.categoryId) } : emptyRelationForm);
    setIsGameCategoryModalOpen(true);
  };

  const openGamePlatformModal = (gp: GamePlatform | null = null) => {
    setEditingGamePlatform(gp);
    setRelationFormData(gp ? { gameId: String(gp.gameId), relationId: String(gp.platformId) } : emptyRelationForm);
    setIsGamePlatformModalOpen(true);
  };

  const handleUserFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGameFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setGameFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: Record<string, any> = {
        username: userFormData.username.trim(),
        email: userFormData.email.trim(),
        firstName: userFormData.firstName.trim(),
        lastName: userFormData.lastName.trim(),
        country: userFormData.country,
        dateOfBirth: userFormData.dateOfBirth.trim(),
        role: userFormData.role,
      };

      if (userFormData.password.trim()) {
        payload.password = userFormData.password;
      }

      if (editingUser?.userId) {
        await adminUsersApi.update(editingUser.userId as any, payload);
      } else {
        await adminUsersApi.create(payload);
      }

      setIsUserModalOpen(false);
      setEditingUser(null);
      setUserFormData(emptyUserForm);
      await fetchAdminData();
    } catch (error: any) {
      console.error('User save error:', error);
      alert(error?.message || 'Error saving user');
    }
  };

  const handleGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: Record<string, any> = {
        title: gameFormData.title.trim(),
        basePrice: Number(gameFormData.basePrice),
      };

      if (gameFormData.description.trim()) {
        payload.description = gameFormData.description.trim();
      }

      if (gameFormData.releaseDate.trim()) {
        payload.releaseDate = gameFormData.releaseDate.trim();
      }

      if (gameFormData.developer.trim()) {
        payload.developer = gameFormData.developer.trim();
      }

      if (gameFormData.publisher.trim()) {
        payload.publisher = gameFormData.publisher.trim();
      }

      if (gameFormData.ageRating.trim()) {
        payload.ageRating = gameFormData.ageRating.trim();
      }

      if (editingGame?.gameId) {
        await adminGamesApi.update(editingGame.gameId, payload);
      } else {
        await adminGamesApi.create(payload);
      }

      setIsGameModalOpen(false);
      setEditingGame(null);
      setGameFormData(emptyGameForm);
      await fetchAdminData();
    } catch (error: any) {
      alert(error?.message || 'Error saving game');
      console.error('Game save error:', error);
    }
  };

  const handleGenericChange = (setter: any) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (platformFormData.platformName !== 'ps4' && platformFormData.platformName !== 'ps5') {
        alert('Platform name must be exactly ps4 or ps5');
        return;
      }
      if (editingPlatform?.platformId) {
        await adminPlatformsApi.update(editingPlatform.platformId, platformFormData);
      } else {
        await adminPlatformsApi.create(platformFormData);
      }
      setIsPlatformModalOpen(false);
      await fetchAdminData();
    } catch (err: any) {
      alert(err?.message || 'Error saving platform');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory?.categoryId) {
        await adminCategoriesApi.update(editingCategory.categoryId, categoryFormData);
      } else {
        await adminCategoriesApi.create(categoryFormData);
      }
      setIsCategoryModalOpen(false);
      await fetchAdminData();
    } catch (err: any) {
      alert(err?.message || 'Error saving category');
    }
  };

  const handleGameCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gId = parseInt(relationFormData.gameId, 10);
      const cId = parseInt(relationFormData.relationId, 10);
      if (isNaN(gId) || isNaN(cId)) { alert('Game and Category are required'); return; }

      if (editingGameCategory) {
        await adminGameCategoriesApi.update(editingGameCategory.gameId, editingGameCategory.categoryId, { newCategoryId: cId });
      } else {
        await adminGameCategoriesApi.create({ gameId: gId, categoryId: cId });
      }
      setIsGameCategoryModalOpen(false);
      await fetchAdminData();
    } catch (err: any) {
      alert(err?.message || 'Error saving Game-Category relation (Possible Duplicate)');
    }
  };

  const handleGamePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gId = parseInt(relationFormData.gameId, 10);
      const pId = parseInt(relationFormData.relationId, 10);
      if (isNaN(gId) || isNaN(pId)) { alert('Game and Platform are required'); return; }

      if (editingGamePlatform) {
        await adminGamePlatformsApi.update(editingGamePlatform.gameId, editingGamePlatform.platformId, { newPlatformId: pId });
      } else {
        await adminGamePlatformsApi.create({ gameId: gId, platformId: pId });
      }
      setIsGamePlatformModalOpen(false);
      await fetchAdminData();
    } catch (err: any) {
      alert(err?.message || 'Error saving Game-Platform relation (Possible Duplicate)');
    }
  };

  const deleteUser = async (id: string) => {
    if (
      confirm(
        'Critical Action: Are you sure you want to hard-delete this user? All user data will be lost.',
      )
    ) {
      try {
        await adminUsersApi.remove(id as any);
        await fetchAdminData();
      } catch (err: any) {
        alert(err?.message || 'Failed to delete user');
        console.error('User delete error:', err);
      }
    }
  };

  const deleteGame = async (id: number | string) => {
    if (confirm('Critical Action: Are you sure you want to delete this game?')) {
      try {
        await adminGamesApi.remove(id as any);
        await fetchAdminData();
      } catch (err: any) {
        alert(err?.message || 'Failed to delete game');
        console.error('Game delete error:', err);
      }
    }
  };

  const deleteRecord = async (action: () => Promise<any>) => {
    if (confirm('Critical Action: Are you sure you want to delete this record?')) {
      try {
        await action();
        await fetchAdminData();
      } catch (err: any) { alert(err?.message || 'Failed to delete record'); }
    }
  };

  const filteredUsers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return usersList.filter((u) => {
      const username = u.username?.toLowerCase() || '';
      const email = u.email?.toLowerCase() || '';
      return username.includes(normalized) || email.includes(normalized);
    });
  }, [usersList, searchTerm]);

  const filteredGames = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return gamesList.filter((g) =>
      (g.title || '').toLowerCase().includes(normalized),
    );
  }, [gamesList, searchTerm]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans selection:bg-blue-600 selection:text-white">
      <div className="w-72 bg-gray-800 p-6 flex flex-col space-y-3 border-r border-gray-700 shadow-2xl relative z-10">
        <div className="mb-8 border-b border-gray-700 pb-6 text-center">
          <h2 className="text-3xl items-center font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase">
            Admin Ops
          </h2>
          <p className="text-xs text-gray-400 mt-2 font-medium tracking-wider">
            SECURE DASHBOARD
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <svg className="w-5 h-5 mr-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Overview
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'users'
              ? 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <svg className="w-5 h-5 mr-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Directory
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'games'
              ? 'bg-gradient-to-r from-green-600 to-green-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <svg className="w-5 h-5 mr-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Games Library
          </button>

          <button
            onClick={() => setActiveTab('platforms')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'platforms'
              ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-lg opacity-80">🕹️</span> Platforms
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'categories'
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-lg opacity-80">🏷️</span> Categories
          </button>

          <button
            onClick={() => setActiveTab('gameCategories')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'gameCategories'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-lg opacity-80">🔗</span> Game Categories
          </button>

          <button
            onClick={() => setActiveTab('gamePlatforms')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'gamePlatforms'
              ? 'bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-lg opacity-80">🔗</span> Game Platforms
          </button>
        </nav>

        <div className="mt-auto border-t border-gray-700 pt-6">
          <div className="mb-4 text-center">
            <p className="text-sm font-semibold text-gray-300">Signed in as</p>
            <p className="text-lg font-black text-white truncate">{user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-gray-700 hover:bg-red-600 px-4 py-3 rounded-lg transition-colors text-white font-bold group"
          >
            <svg className="w-5 h-5 mr-2 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Terminate Session
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#0f172a]">
        <div className="sticky top-0 bg-[#0f172a]/95 backdrop-blur z-20 px-10 py-8 border-b border-gray-800 shadow-sm flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight capitalize">
              {activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
            <p className="text-gray-400 mt-1 font-medium">Control panel for platform {activeTab.replace(/([A-Z])/g, ' $1').trim()}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/40 text-blue-400 text-sm font-bold border border-blue-800/50">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              System Live
            </div>
          </div>
        </div>

        <div className="p-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-700 border-t-blue-500 border-b-purple-500"></div>
              <p className="text-gray-400 font-medium tracking-wider">Syncing Data...</p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700/50 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
                    <h3 className="text-gray-400 text-sm font-bold tracking-wider mb-2 uppercase">Total Audience Size</h3>
                    <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                      {stats.users}
                    </p>
                  </div>

                  <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700/50">
                    <h3 className="text-gray-400 text-sm font-bold tracking-wider mb-6 uppercase">User Distribution</h3>
                    <div className="flex justify-between items-end border-b border-gray-700 pb-4 mb-4">
                      <span className="text-gray-300 font-medium text-lg">Administrators</span>
                      <span className="text-2xl font-bold text-red-400">{stats.admins}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-gray-300 font-medium text-lg">Standard Users</span>
                      <span className="text-2xl font-bold text-blue-400">{stats.customers}</span>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700/50">
                    <h3 className="text-gray-400 text-sm font-bold tracking-wider mb-6 uppercase">Content Metrics</h3>
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-300 font-medium">Published Games</span>
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-800/50 rounded-full font-bold">
                          {stats.games}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-300 font-medium">Active Categories</span>
                        <span className="font-bold text-white">{stats.categories}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-300 font-medium">Supported Platforms</span>
                        <span className="font-bold text-white">{stats.platforms}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Data Table Sections */}
              {(activeTab === 'platforms' || activeTab === 'categories' || activeTab === 'gameCategories' || activeTab === 'gamePlatforms') && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm">
                    <div className="relative w-full sm:w-96">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (activeTab === 'platforms') openPlatformModal();
                        if (activeTab === 'categories') openCategoryModal();
                        if (activeTab === 'gameCategories') openGameCategoryModal();
                        if (activeTab === 'gamePlatforms') openGamePlatformModal();
                      }}
                      className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-sm font-bold shadow-lg transition-all text-white"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      Add New
                    </button>
                  </div>

                  <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                          <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                            {activeTab === 'platforms' && <><th className="px-6 py-4">ID</th><th className="px-6 py-4">Name</th></>}
                            {activeTab === 'categories' && <><th className="px-6 py-4">ID</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Desc</th></>}
                            {activeTab === 'gameCategories' && <><th className="px-6 py-4">Game</th><th className="px-6 py-4">Category</th></>}
                            {activeTab === 'gamePlatforms' && <><th className="px-6 py-4">Game</th><th className="px-6 py-4">Platform</th></>}
                            <th className="px-6 py-4 text-right">Manage</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-700">
                          {activeTab === 'platforms' && platformsList.filter(p => p.platformName.toLowerCase().includes(normalizedSearch)).map(p => (
                            <tr key={p.platformId} className="hover:bg-gray-750">
                              <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.platformId}</td>
                              <td className="px-6 py-4 font-bold text-white uppercase">{p.platformName}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button onClick={() => openPlatformModal(p)} className="p-2 text-gray-400 hover:text-white transition-colors">Edit</button>
                                  <button onClick={() => deleteRecord(() => adminPlatformsApi.remove(p.platformId))} className="p-2 text-gray-400 hover:text-red-400">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {activeTab === 'categories' && categoriesList.filter(c => c.categoryName.toLowerCase().includes(normalizedSearch)).map(c => (
                            <tr key={c.categoryId} className="hover:bg-gray-750">
                              <td className="px-6 py-4 text-gray-500 font-mono text-xs">{c.categoryId}</td>
                              <td className="px-6 py-4 font-bold text-white">{c.categoryName}</td>
                              <td className="px-6 py-4 text-gray-400">{c.description}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button onClick={() => openCategoryModal(c)} className="p-2 text-gray-400 hover:text-white transition-colors">Edit</button>
                                  <button onClick={() => deleteRecord(() => adminCategoriesApi.remove(c.categoryId))} className="p-2 text-gray-400 hover:text-red-400">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {activeTab === 'gameCategories' && gameCategoriesList.map((gc, i) => (
                            <tr key={i} className="hover:bg-gray-750">
                              <td className="px-6 py-4 font-bold text-white">{gc.game?.title || gc.gameId}</td>
                              <td className="px-6 py-4">{gc.category?.categoryName || gc.categoryId}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button onClick={() => openGameCategoryModal(gc)} className="p-2 text-gray-400 hover:text-white transition-colors">Edit</button>
                                  <button onClick={() => deleteRecord(() => adminGameCategoriesApi.remove(gc.gameId, gc.categoryId))} className="p-2 text-gray-400 hover:text-red-400">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {activeTab === 'gamePlatforms' && gamePlatformsList.map((gp, i) => (
                            <tr key={i} className="hover:bg-gray-750">
                              <td className="px-6 py-4 font-bold text-white">{gp.game?.title || gp.gameId}</td>
                              <td className="px-6 py-4 uppercase">{gp.platform?.platformName || gp.platformId}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button onClick={() => openGamePlatformModal(gp)} className="p-2 text-gray-400 hover:text-white transition-colors">Edit</button>
                                  <button onClick={() => deleteRecord(() => adminGamePlatformsApi.remove(gp.gameId, gp.platformId))} className="p-2 text-gray-400 hover:text-red-400">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm">
                    <div className="relative w-full sm:w-96">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow"
                      />
                    </div>
                    <button
                      onClick={() => openUserModal()}
                      className="w-full sm:w-auto flex items-center justify-center bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg text-sm font-bold shadow-lg shadow-purple-900/20 transition-all text-white"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create User
                    </button>
                  </div>

                  <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                          <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Profile</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Join Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-700">
                          {filteredUsers.map((u) => (
                            <tr key={u.userId} className="hover:bg-gray-750 transition-colors">
                              <td className="px-6 py-4 text-gray-500 font-mono text-xs">{u.userId}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-white text-base">{u.username}</span>
                                  <span className="text-gray-400 text-xs mt-0.5">{u.email}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${u.role === 'admin'
                                    ? 'bg-red-900/30 text-red-400 border-red-800/50'
                                    : 'bg-blue-900/30 text-blue-400 border-blue-800/50'
                                    }`}
                                >
                                  {u.role.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-400 font-medium">
                                {new Date(u.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => openUserModal(u)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                    title="Edit User"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  {u.userId !== user?.userId && (
                                    <button
                                      onClick={() => deleteUser(u.userId)}
                                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                      title="Delete User"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                          {usersList.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium italic">
                                No users found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'games' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm">
                    <div className="relative w-full sm:w-96">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search games by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-shadow"
                      />
                    </div>
                    <button
                      onClick={() => openGameModal()}
                      className="w-full sm:w-auto flex items-center justify-center bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg text-sm font-bold shadow-lg shadow-green-900/20 transition-all text-white"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Game
                    </button>
                  </div>

                  <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                          <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                            <th className="px-6 py-4 w-16">ID</th>
                            <th className="px-6 py-4">Game Information</th>
                            <th className="px-6 py-4">Base Price</th>
                            <th className="px-6 py-4 text-right">Manage</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-700">
                          {filteredGames.map((g) => (
                            <tr key={g.gameId} className="hover:bg-gray-750 transition-colors">
                              <td className="px-6 py-4 text-gray-500 font-mono text-xs">{g.gameId}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-white text-base">{g.title}</span>
                                  {g.developer && (
                                    <span className="text-gray-400 text-xs mt-0.5">
                                      {g.developer}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-green-400 font-black tracking-wider text-base">
                                  ${Number(g.basePrice).toFixed(2)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => openGameModal(g)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                    title="Edit Game"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => deleteGame(g.gameId)}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                    title="Delete Game"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {gamesList.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium italic">
                                No games deployed.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-2xl font-black text-white tracking-wide uppercase">
                {editingUser ? 'Edit User' : 'Create User'}
              </h2>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={userFormData.username}
                  onChange={handleUserFormChange}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userFormData.email}
                  onChange={handleUserFormChange}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={userFormData.firstName}
                    onChange={handleUserFormChange}
                    className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={userFormData.lastName}
                    onChange={handleUserFormChange}
                    className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={userFormData.country}
                  onChange={handleUserFormChange}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  required
                >
                  <option value="">Select a country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Date of Birth (YYYY-MM-DD)
                </label>
                <input
                  type="text"
                  name="dateOfBirth"
                  placeholder="YYYY-MM-DD"
                  pattern="\d{4}-\d{2}-\d{2}"
                  value={userFormData.dateOfBirth || ''}
                  onChange={handleUserFormChange}
                  required
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {editingUser ? 'New Password (optional)' : 'Password'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={userFormData.password}
                  onChange={handleUserFormChange}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                  required={!editingUser}
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Access Level
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserFormChange}
                    className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none appearance-none font-bold tracking-wider"
                  >
                    <option value="playstation_user">CUSTOMER (Standard)</option>
                    <option value="admin">SYSTEM ADMIN (Full Access)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-gray-300 hover:text-white bg-transparent hover:bg-gray-700 rounded-lg transition-all border border-gray-600"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm flex items-center bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-lg shadow-purple-900/40 transition-all uppercase tracking-wider"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Commit User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGameModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-2xl font-black text-white tracking-wide uppercase">
                {editingGame ? 'Edit Game' : 'Create Game'}
              </h2>
              <button
                onClick={() => setIsGameModalOpen(false)}
                className="text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleGameSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={gameFormData.title}
                  onChange={handleGameFormChange}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={gameFormData.description}
                  onChange={handleGameFormChange}
                  rows={4}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Release Date (YYYY-MM-DD)
                </label>
                <input
                  type="text"
                  name="releaseDate"
                  placeholder="YYYY-MM-DD"
                  pattern="\d{4}-\d{2}-\d{2}"
                  value={gameFormData.releaseDate}
                  onChange={handleGameFormChange}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Base Price
                </label>
                <input
                  type="number"
                  name="basePrice"
                  min="0"
                  step="0.01"
                  value={gameFormData.basePrice}
                  onChange={handleGameFormChange}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Developer
                </label>
                <input
                  type="text"
                  name="developer"
                  value={gameFormData.developer}
                  onChange={handleGameFormChange}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Publisher
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={gameFormData.publisher}
                  onChange={handleGameFormChange}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Age Rating
                </label>
                <input
                  type="text"
                  name="ageRating"
                  value={gameFormData.ageRating}
                  onChange={handleGameFormChange}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => setIsGameModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-gray-300 hover:text-white bg-transparent hover:bg-gray-700 rounded-lg transition-all border border-gray-600"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm flex items-center bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-lg shadow-green-900/40 transition-all uppercase tracking-wider"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Commit Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW MODALS */}
      {isPlatformModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 transform transition-all scale-100">
            <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-6 border-b border-gray-700 pb-4">
              {editingPlatform ? "Edit Platform" : "Create Platform"}
            </h2>
            <form onSubmit={handlePlatformSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Platform Name</label>
                <select name="platformName" value={platformFormData.platformName} onChange={handleGenericChange(setPlatformFormData)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white" required>
                  <option value="">Select Platform Type</option>
                  <option value="ps4">PS4</option>
                  <option value="ps5">PS5</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-4">
                <button type="button" onClick={() => setIsPlatformModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-300 hover:text-white bg-transparent hover:bg-gray-700 rounded-lg transition-all border border-gray-600">Dismiss</button>
                <button type="submit" className="px-6 py-3 text-sm bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold shadow-lg uppercase tracking-wider">Save Platform</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 transform transition-all scale-100">
            <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-6 border-b border-gray-700 pb-4">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h2>
            <form onSubmit={handleCategorySubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category Name</label>
                <input type="text" name="categoryName" value={categoryFormData.categoryName} onChange={handleGenericChange(setCategoryFormData)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea name="description" value={categoryFormData.description} onChange={handleGenericChange(setCategoryFormData)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-4">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-300 hover:text-white bg-transparent hover:bg-gray-700 rounded-lg transition-all border border-gray-600">Dismiss</button>
                <button type="submit" className="px-6 py-3 text-sm bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-bold shadow-lg uppercase tracking-wider">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(isGameCategoryModalOpen || isGamePlatformModalOpen) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 transform transition-all scale-100">
            <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-6 border-b border-gray-700 pb-4">
              {isGameCategoryModalOpen
                ? (editingGameCategory ? "Edit Game Category" : "Link Game Category")
                : (editingGamePlatform ? "Edit Game Platform" : "Link Game Platform")}
            </h2>
            <form onSubmit={isGameCategoryModalOpen ? handleGameCategorySubmit : handleGamePlatformSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Game</label>
                <select name="gameId" value={relationFormData.gameId} onChange={handleGenericChange(setRelationFormData)} disabled={!!(editingGameCategory || editingGamePlatform)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white disabled:opacity-50" required>
                  <option value="">Select Game</option>
                  {gamesList.map(g => <option key={g.gameId} value={g.gameId}>{g.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select {isGameCategoryModalOpen ? 'Category' : 'Platform'}</label>
                <select name="relationId" value={relationFormData.relationId} onChange={handleGenericChange(setRelationFormData)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white" required>
                  <option value="">Select {isGameCategoryModalOpen ? 'Category' : 'Platform'}</option>
                  {isGameCategoryModalOpen && categoriesList.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                  {isGamePlatformModalOpen && platformsList.map(p => <option key={p.platformId} value={p.platformId}>{p.platformName}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-4">
                <button type="button" onClick={() => { setIsGameCategoryModalOpen(false); setIsGamePlatformModalOpen(false); }} className="px-6 py-3 text-sm font-bold text-gray-300 hover:text-white bg-transparent hover:bg-gray-700 rounded-lg transition-all border border-gray-600">Dismiss</button>
                <button type="submit" className="px-6 py-3 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg uppercase tracking-wider">Save Relation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;