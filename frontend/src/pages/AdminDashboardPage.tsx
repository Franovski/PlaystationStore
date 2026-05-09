import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { logoutUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  adminSummaryApi,
  adminUsersApi,
  adminGamesApi,
  adminPlatformsApi,
  adminCategoriesApi,
  adminGameCategoriesApi,
  adminGamePlatformsApi,
  adminDlcApi,
  adminOrdersApi,
  adminOrderItemsApi,
  adminWalletsApi,
  adminUserLibraryApi,
  adminWishlistsApi,
  adminReviewsApi,
  adminDiscountsApi,
  adminEditionsApi,
} from '../api/adminApi';
import AdminStoreModePanel from './AdminStoreModePanel';
import {
  User,
  Game,
  Platform,
  Category,
  GameCategory,
  GamePlatform,
  DLC,
  Order,
  OrderItem,
  UserWallet,
  UserLibrary,
  Wishlist,
  Review,
  Discount,
  Edition,
} from '../types';

type AdminTab =
  | 'dashboard'
  | 'users'
  | 'games'
  | 'platforms'
  | 'categories'
  | 'gameCategories'
  | 'gamePlatforms'
  | 'dlcs'
  | 'orders'
  | 'orderItems'
  | 'wallets'
  | 'libraries'
  | 'wishlists'
  | 'reviews'
  | 'discounts'
  | 'editions';

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
};

type GameRelationFormState = {
  gameId: string;
  relationId: string;
};

type DLCFormState = {
  name: string;
  price: string;
  releaseDate: string;
  gameId: string;
};

type DiscountFormState = {
  percentage: string;
  startDate: string;
  endDate: string;
  gameId: string;
};

type EditionFormState = {
  name: string;
  price: string;
  includes: string;
  gameId: string;
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
const emptyCategoryForm: CategoryFormState = { categoryName: '' };
const emptyRelationForm: GameRelationFormState = { gameId: '', relationId: '' };

const emptyDLCForm: DLCFormState = {
  name: '',
  price: '',
  releaseDate: '',
  gameId: '',
};

const emptyDiscountForm: DiscountFormState = {
  percentage: '',
  startDate: '',
  endDate: '',
  gameId: '',
};

const emptyEditionForm: EditionFormState = {
  name: '',
  price: '',
  includes: '',
  gameId: '',
};

const formatPrice = (value: number | string | undefined | null) => `$${Number(value ?? 0).toFixed(2)}`;
const formatDate = (value: string | undefined | null) => (value ? String(value).slice(0, 10) : 'N/A');
const getErrorMessage = (err: unknown) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : 'Request failed';

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [adminMode, setAdminMode] = useState<'admin' | 'store'>('admin');
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
  const [dlcsList, setDlcsList] = useState<DLC[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [orderItemsList, setOrderItemsList] = useState<OrderItem[]>([]);
  const [walletsList, setWalletsList] = useState<UserWallet[]>([]);
  const [librariesList, setLibrariesList] = useState<UserLibrary[]>([]);
  const [wishlistsList, setWishlistsList] = useState<Wishlist[]>([]);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [discountsList, setDiscountsList] = useState<Discount[]>([]);
  const [editionsList, setEditionsList] = useState<Edition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isGameCategoryModalOpen, setIsGameCategoryModalOpen] = useState(false);
  const [isGamePlatformModalOpen, setIsGamePlatformModalOpen] = useState(false);
  const [isDLCModalOpen, setIsDLCModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isEditionModalOpen, setIsEditionModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingGameCategory, setEditingGameCategory] = useState<GameCategory | null>(null);
  const [editingGamePlatform, setEditingGamePlatform] = useState<GamePlatform | null>(null);
  const [editingDLC, setEditingDLC] = useState<DLC | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [editingEdition, setEditingEdition] = useState<Edition | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [userFormData, setUserFormData] = useState<UserFormState>(emptyUserForm);
  const [gameFormData, setGameFormData] = useState<GameFormState>(emptyGameForm);
  const [platformFormData, setPlatformFormData] = useState<PlatformFormState>(emptyPlatformForm);
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormState>(emptyCategoryForm);
  const [relationFormData, setRelationFormData] = useState<GameRelationFormState>(emptyRelationForm);
  const [dlcFormData, setDLCFormData] = useState(emptyDLCForm);
  const [discountFormData, setDiscountFormData] = useState<DiscountFormState>(emptyDiscountForm);
  const [editionFormData, setEditionFormData] = useState<EditionFormState>(emptyEditionForm);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/user');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (adminMode === 'admin') {
      fetchAdminData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, adminMode]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setSearchTerm('');
    setAdminError(null);

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
      } else if (activeTab === 'dlcs') {
        const games: any = await adminGamesApi.getAll();
        setGamesList(Array.isArray(games) ? games : []);

        const dlcs: any = await adminDlcApi.getAll();
        setDlcsList(Array.isArray(dlcs) ? dlcs : []);
      } else if (activeTab === 'orders') {
        const res: any = await adminOrdersApi.getAll();
        setOrdersList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'orderItems') {
        const res: any = await adminOrderItemsApi.getAll();
        setOrderItemsList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'wallets') {
        const res: any = await adminWalletsApi.getAll();
        setWalletsList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'libraries') {
        const res: any = await adminUserLibraryApi.getAll();
        setLibrariesList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'wishlists') {
        const res: any = await adminWishlistsApi.getAll();
        setWishlistsList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'reviews') {
        const res: any = await adminReviewsApi.getAll();
        setReviewsList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'discounts') {
        const games: any = await adminGamesApi.getAll();
        setGamesList(Array.isArray(games) ? games : []);

        const res: any = await adminDiscountsApi.getAll();
        setDiscountsList(Array.isArray(res) ? res : []);
      } else if (activeTab === 'editions') {
        const games: any = await adminGamesApi.getAll();
        setGamesList(Array.isArray(games) ? games : []);

        const res: any = await adminEditionsApi.getAll();
        setEditionsList(Array.isArray(res) ? res : []);
      }
    } catch (err) {
      console.error(`Failed to load admin data for ${activeTab}`, err);
      setAdminError(getErrorMessage(err));
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
    setCategoryFormData(c ? { categoryName: c.categoryName } : emptyCategoryForm);
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

  const openDLCModal = (dlcToEdit: DLC | null = null) => {
    setEditingDLC(dlcToEdit);

    if (dlcToEdit) {
      setDLCFormData({
        name: dlcToEdit.name || '',
        price:
          dlcToEdit.price !== undefined && dlcToEdit.price !== null
            ? String(dlcToEdit.price)
            : '',
        releaseDate: dlcToEdit.releaseDate
          ? String(dlcToEdit.releaseDate).slice(0, 10)
          : '',
        gameId: dlcToEdit.gameId ? String(dlcToEdit.gameId) : '',
      });
    } else {
      setDLCFormData(emptyDLCForm);
    }

    setIsDLCModalOpen(true);
  };

  const openDiscountModal = (discountToEdit: Discount | null = null) => {
    setEditingDiscount(discountToEdit);

    if (discountToEdit) {
      setDiscountFormData({
        percentage:
          discountToEdit.percentage !== undefined && discountToEdit.percentage !== null
            ? String(discountToEdit.percentage)
            : '',
        startDate: discountToEdit.startDate ? String(discountToEdit.startDate).slice(0, 10) : '',
        endDate: discountToEdit.endDate ? String(discountToEdit.endDate).slice(0, 10) : '',
        gameId: discountToEdit.gameId ? String(discountToEdit.gameId) : '',
      });
    } else {
      setDiscountFormData(emptyDiscountForm);
    }

    setIsDiscountModalOpen(true);
  };

  const openEditionModal = (editionToEdit: Edition | null = null) => {
    setEditingEdition(editionToEdit);

    if (editionToEdit) {
      setEditionFormData({
        name: editionToEdit.name || '',
        price:
          editionToEdit.price !== undefined && editionToEdit.price !== null
            ? String(editionToEdit.price)
            : '',
        includes: editionToEdit.includes || '',
        gameId: editionToEdit.gameId ? String(editionToEdit.gameId) : '',
      });
    } else {
      setEditionFormData(emptyEditionForm);
    }

    setIsEditionModalOpen(true);
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
        setAdminSuccess('User updated.');
      } else {
        await adminUsersApi.create(payload);
        setAdminSuccess('User created.');
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
        setAdminSuccess('Game updated.');
      } else {
        await adminGamesApi.create(payload);
        setAdminSuccess('Game created.');
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
        setAdminSuccess('Platform updated.');
      } else {
        await adminPlatformsApi.create(platformFormData);
        setAdminSuccess('Platform created.');
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
        setAdminSuccess('Category updated.');
      } else {
        await adminCategoriesApi.create(categoryFormData);
        setAdminSuccess('Category created.');
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
        setAdminSuccess('Game category relation updated.');
      } else {
        await adminGameCategoriesApi.create({ gameId: gId, categoryId: cId });
        setAdminSuccess('Game category relation created.');
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
        setAdminSuccess('Game platform relation updated.');
      } else {
        await adminGamePlatformsApi.create({ gameId: gId, platformId: pId });
        setAdminSuccess('Game platform relation created.');
      }
      setIsGamePlatformModalOpen(false);
      await fetchAdminData();
    } catch (err: any) {
      alert(err?.message || 'Error saving Game-Platform relation (Possible Duplicate)');
    }
  };

  const handleDLCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: Record<string, any> = {
        name: dlcFormData.name.trim(),
        price: Number(dlcFormData.price),
        gameId: Number(dlcFormData.gameId),
      };

      if (dlcFormData.releaseDate.trim()) {
        payload.releaseDate = dlcFormData.releaseDate.trim();
      }

      if (!payload.name) {
        alert('DLC name is required');
        return;
      }

      if (Number.isNaN(payload.price)) {
        alert('DLC price must be a valid number');
        return;
      }

      if (Number.isNaN(payload.gameId)) {
        alert('Please select a game');
        return;
      }

      if (editingDLC?.dlcId) {
        await adminDlcApi.update(editingDLC.dlcId, payload);
        setAdminSuccess('DLC updated.');
      } else {
        console.log('DLC payload:', payload);
        await adminDlcApi.create(payload);
        setAdminSuccess('DLC created.');
      }

      setIsDLCModalOpen(false);
      setEditingDLC(null);
      setDLCFormData(emptyDLCForm);
      await fetchAdminData();
    } catch (error: any) {
      alert(error?.message || 'Error saving DLC');
      console.error('DLC save error:', error);
    }
  };

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        percentage: Number(discountFormData.percentage),
        startDate: discountFormData.startDate.trim(),
        endDate: discountFormData.endDate.trim(),
        gameId: Number(discountFormData.gameId),
      };

      if (Number.isNaN(payload.percentage) || payload.percentage <= 0) {
        setAdminError('Discount percentage must be greater than zero.');
        return;
      }

      if (!payload.startDate || !payload.endDate) {
        setAdminError('Discount start and end dates are required.');
        return;
      }

      if (Number.isNaN(payload.gameId)) {
        setAdminError('Please select a game.');
        return;
      }

      if (editingDiscount?.discountId) {
        await adminDiscountsApi.update(editingDiscount.discountId, payload);
        setAdminSuccess('Discount updated.');
      } else {
        await adminDiscountsApi.create(payload);
        setAdminSuccess('Discount created.');
      }

      setIsDiscountModalOpen(false);
      setEditingDiscount(null);
      setDiscountFormData(emptyDiscountForm);
      await fetchAdminData();
    } catch (error) {
      setAdminError(getErrorMessage(error));
    }
  };

  const handleEditionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: editionFormData.name.trim(),
        price: Number(editionFormData.price),
        includes: editionFormData.includes.trim(),
        gameId: Number(editionFormData.gameId),
      };

      if (!payload.name) {
        setAdminError('Edition name is required.');
        return;
      }

      if (Number.isNaN(payload.price) || payload.price < 0) {
        setAdminError('Edition price must be a valid number.');
        return;
      }

      if (Number.isNaN(payload.gameId)) {
        setAdminError('Please select a game.');
        return;
      }

      if (editingEdition?.editionId) {
        await adminEditionsApi.update(editingEdition.editionId, payload);
        setAdminSuccess('Edition updated.');
      } else {
        await adminEditionsApi.create(payload);
        setAdminSuccess('Edition created.');
      }

      setIsEditionModalOpen(false);
      setEditingEdition(null);
      setEditionFormData(emptyEditionForm);
      await fetchAdminData();
    } catch (error) {
      setAdminError(getErrorMessage(error));
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
        setAdminSuccess('Record deleted.');
        await fetchAdminData();
      } catch (err) {
        setAdminError(getErrorMessage(err));
      }
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

  const filteredDLCs = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return dlcsList.filter((dlc) => {
      const name = dlc.name?.toLowerCase() || '';
      const gameTitle = dlc.game?.title?.toLowerCase() || '';

      return name.includes(normalized) || gameTitle.includes(normalized);
    });
  }, [dlcsList, searchTerm]);

  const filteredOrders = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return ordersList.filter((order) => {
      const owner = order.user?.username?.toLowerCase() || order.user?.email?.toLowerCase() || '';
      return (
        String(order.orderId).includes(normalized) ||
        owner.includes(normalized) ||
        (order.status || '').toLowerCase().includes(normalized) ||
        (order.paymentMethod || '').toLowerCase().includes(normalized)
      );
    });
  }, [ordersList, searchTerm]);

  const filteredOrderItems = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return orderItemsList.filter((item) => {
      const owner = item.order?.user?.username?.toLowerCase() || item.order?.user?.email?.toLowerCase() || '';
      return (
        String(item.orderItemId).includes(normalized) ||
        String(item.orderId).includes(normalized) ||
        (item.itemType || '').toLowerCase().includes(normalized) ||
        owner.includes(normalized)
      );
    });
  }, [orderItemsList, searchTerm]);

  const filteredWallets = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return walletsList.filter((wallet) => {
      const owner = wallet.user?.username?.toLowerCase() || wallet.user?.email?.toLowerCase() || '';
      return String(wallet.walletId).includes(normalized) || owner.includes(normalized) || wallet.userId.toLowerCase().includes(normalized);
    });
  }, [walletsList, searchTerm]);

  const filteredLibraries = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return librariesList.filter((item) => {
      const owner = item.user?.username?.toLowerCase() || item.user?.email?.toLowerCase() || '';
      return (
        String(item.libraryId).includes(normalized) ||
        owner.includes(normalized) ||
        (item.itemType || '').toLowerCase().includes(normalized) ||
        String(item.itemId).includes(normalized)
      );
    });
  }, [librariesList, searchTerm]);

  const filteredWishlists = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return wishlistsList.filter((item) => {
      const owner = item.user?.username?.toLowerCase() || item.user?.email?.toLowerCase() || '';
      const gameTitle = item.game?.title?.toLowerCase() || '';
      return owner.includes(normalized) || gameTitle.includes(normalized) || String(item.wishlistId).includes(normalized);
    });
  }, [wishlistsList, searchTerm]);

  const filteredReviews = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return reviewsList.filter((review) => {
      const owner = review.user?.username?.toLowerCase() || review.user?.email?.toLowerCase() || '';
      const gameTitle = review.game?.title?.toLowerCase() || '';
      return (
        owner.includes(normalized) ||
        gameTitle.includes(normalized) ||
        (review.comment || '').toLowerCase().includes(normalized) ||
        String(review.reviewId).includes(normalized)
      );
    });
  }, [reviewsList, searchTerm]);

  const filteredDiscounts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return discountsList.filter((discount) => {
      const gameTitle = discount.game?.title?.toLowerCase() || '';
      return gameTitle.includes(normalized) || String(discount.discountId).includes(normalized);
    });
  }, [discountsList, searchTerm]);

  const filteredEditions = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return editionsList.filter((edition) => {
      const gameTitle = edition.game?.title?.toLowerCase() || '';
      return (
        (edition.name || '').toLowerCase().includes(normalized) ||
        gameTitle.includes(normalized) ||
        String(edition.editionId).includes(normalized)
      );
    });
  }, [editionsList, searchTerm]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const ownerLabel = (owner?: User | null, fallbackId?: string) =>
    owner?.username || owner?.email || fallbackId || 'Unknown user';

  const renderEmptyRow = (colSpan: number, message: string) => (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center text-gray-500 font-medium italic">
        {message}
      </td>
    </tr>
  );

  const renderAdminToolbar = (
    placeholder: string,
    focusClass: string,
    action?: { label: string; className: string; onClick: () => void },
  ) => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm">
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className={`w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-shadow ${focusClass}`}
        />
      </div>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-lg text-sm font-bold shadow-lg transition-all text-white ${action.className}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {action.label}
        </button>
      )}
    </div>
  );

  const renderOrdersSection = () => (
    <div className="space-y-6">
      {renderAdminToolbar('Search orders by ID, user, status, or payment...', 'focus:border-orange-500 focus:ring-orange-500')}
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Order Date</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-750 transition-colors align-top">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{order.orderId}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{ownerLabel(order.user, order.userId)}</span>
                      <span className="text-gray-500 text-xs">{order.userId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium">{formatDate(order.orderDate)}</td>
                  <td className="px-6 py-4 text-orange-300 font-bold uppercase">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {(order.items ?? []).map((item) => (
                        <div key={item.orderItemId} className="text-gray-300">
                          {item.itemType} #{item.itemId} <span className="text-gray-500">({formatPrice(item.price)})</span>
                        </div>
                      ))}
                      {(order.items ?? []).length === 0 && <span className="text-gray-500">No items</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-orange-400 font-black">{formatPrice(order.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border bg-orange-900/30 text-orange-300 border-orange-800/50">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && renderEmptyRow(7, 'No orders found.')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrderItemsSection = () => (
    <div className="space-y-6">
      {renderAdminToolbar('Search order items by item, order, or user...', 'focus:border-cyan-500 focus:ring-cyan-500')}
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Price</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {filteredOrderItems.map((item) => (
                <tr key={item.orderItemId} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.orderItemId}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">Order #{item.orderId}</span>
                      <span className="text-gray-500 text-xs">{formatDate(item.order?.orderDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{ownerLabel(item.order?.user, item.order?.userId)}</td>
                  <td className="px-6 py-4">
                    <span className="text-cyan-300 font-black uppercase">{item.itemType}</span>
                    <span className="text-gray-400 ml-2">#{item.itemId}</span>
                  </td>
                  <td className="px-6 py-4 text-cyan-400 font-black">{formatPrice(item.price)}</td>
                </tr>
              ))}
              {filteredOrderItems.length === 0 && renderEmptyRow(5, 'No order items found.')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWalletsSection = () => (
    <div className="space-y-6">
      {renderAdminToolbar('Search wallets by ID or user...', 'focus:border-emerald-500 focus:ring-emerald-500')}
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Updated</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {filteredWallets.map((wallet) => (
                <tr key={wallet.walletId} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{wallet.walletId}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{ownerLabel(wallet.user, wallet.userId)}</span>
                      <span className="text-gray-500 text-xs">{wallet.userId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-black">{formatPrice(wallet.balance)}</td>
                  <td className="px-6 py-4 text-gray-400">{formatDate(wallet.updatedAt)}</td>
                </tr>
              ))}
              {filteredWallets.length === 0 && renderEmptyRow(4, 'No wallets found.')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLibrariesSection = () => (
    <div className="space-y-6">
      {renderAdminToolbar('Search libraries by ID, user, item type, or item ID...', 'focus:border-lime-500 focus:ring-lime-500')}
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Owned Item</th>
                <th className="px-6 py-4">Purchase Date</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {filteredLibraries.map((item) => (
                <tr key={item.libraryId} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.libraryId}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{ownerLabel(item.user, item.userId)}</span>
                      <span className="text-gray-500 text-xs">{item.userId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lime-300 font-black uppercase">{item.itemType}</span>
                    <span className="text-gray-400 ml-2">#{item.itemId}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{formatDate(item.purchaseDate)}</td>
                </tr>
              ))}
              {filteredLibraries.length === 0 && renderEmptyRow(4, 'No library records found.')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWishlistsSection = () => (
    <div className="space-y-6">
      {renderAdminToolbar('Search wishlists by user or game...', 'focus:border-rose-500 focus:ring-rose-500')}
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">Added</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {filteredWishlists.map((item) => (
                <tr key={item.wishlistId} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.wishlistId}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{ownerLabel(item.user, item.userId)}</span>
                      <span className="text-gray-500 text-xs">{item.userId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-rose-300 font-bold">{item.game?.title || `Game #${item.gameId}`}</td>
                  <td className="px-6 py-4 text-gray-400">{formatDate(item.addedAt)}</td>
                </tr>
              ))}
              {filteredWishlists.length === 0 && renderEmptyRow(4, 'No wishlist records found.')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReviewsSection = () => (
    <div className="space-y-6">
      {renderAdminToolbar('Search reviews by user, game, comment, or ID...', 'focus:border-violet-500 focus:ring-violet-500')}
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {filteredReviews.map((review) => (
                <tr key={review.reviewId} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{review.reviewId}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{ownerLabel(review.user, review.userId)}</span>
                      <span className="text-gray-500 text-xs">{review.userId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-violet-300 font-bold">{review.game?.title || `Game #${review.gameId}`}</td>
                  <td className="px-6 py-4 text-white font-black">{review.rating}/5</td>
                  <td className="px-6 py-4 text-gray-300 max-w-md truncate">{review.comment || 'No comment'}</td>
                  <td className="px-6 py-4 text-gray-400">{formatDate(review.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteRecord(() => adminReviewsApi.remove(review.reviewId))}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                      title="Delete Review"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReviews.length === 0 && renderEmptyRow(7, 'No reviews found.')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDiscountsSection = () => (
    <div className="space-y-6">
      {renderAdminToolbar('Search discounts by ID or game...', 'focus:border-sky-500 focus:ring-sky-500', {
        label: 'Create Discount',
        className: 'bg-sky-600 hover:bg-sky-500 shadow-sky-900/20',
        onClick: () => openDiscountModal(),
      })}
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">Percentage</th>
                <th className="px-6 py-4">Start</th>
                <th className="px-6 py-4">End</th>
                <th className="px-6 py-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {filteredDiscounts.map((discount) => (
                <tr key={discount.discountId} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{discount.discountId}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{discount.game?.title || `Game #${discount.gameId}`}</span>
                      <span className="text-gray-500 text-xs">Game ID: {discount.gameId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sky-400 font-black">{Number(discount.percentage).toFixed(0)}%</td>
                  <td className="px-6 py-4 text-gray-400">{formatDate(discount.startDate)}</td>
                  <td className="px-6 py-4 text-gray-400">{formatDate(discount.endDate)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openDiscountModal(discount)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        title="Edit Discount"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteRecord(() => adminDiscountsApi.remove(discount.discountId))}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                        title="Delete Discount"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDiscounts.length === 0 && renderEmptyRow(6, 'No discounts found.')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEditionsSection = () => (
    <div className="space-y-6">
      {renderAdminToolbar('Search editions by name, game, or ID...', 'focus:border-fuchsia-500 focus:ring-fuchsia-500', {
        label: 'Create Edition',
        className: 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-900/20',
        onClick: () => openEditionModal(),
      })}
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Edition</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Includes</th>
                <th className="px-6 py-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {filteredEditions.map((edition) => (
                <tr key={edition.editionId} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{edition.editionId}</td>
                  <td className="px-6 py-4 font-bold text-white">{edition.name}</td>
                  <td className="px-6 py-4 text-fuchsia-300 font-bold">{edition.game?.title || `Game #${edition.gameId}`}</td>
                  <td className="px-6 py-4 text-fuchsia-400 font-black">{formatPrice(edition.price)}</td>
                  <td className="px-6 py-4 text-gray-300 max-w-md truncate">{edition.includes || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditionModal(edition)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        title="Edit Edition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteRecord(() => adminEditionsApi.remove(edition.editionId))}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                        title="Delete Edition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEditions.length === 0 && renderEmptyRow(6, 'No editions found.')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

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

        <div className="grid grid-cols-2 gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setAdminMode('admin')}
            className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
              adminMode === 'admin' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Admin Mode
          </button>
          <button
            type="button"
            onClick={() => setAdminMode('store')}
            className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
              adminMode === 'store' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Store Mode
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1" onClick={() => setAdminMode('admin')}>
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

          <button
            onClick={() => setActiveTab('dlcs')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'dlcs'
              ? 'bg-gradient-to-r from-pink-600 to-pink-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-lg opacity-80">🎮</span> DLCs
          </button>
          <button
            onClick={() => setActiveTab('editions')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'editions'
              ? 'bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-sm opacity-80 font-black">ED</span> Editions
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'discounts'
              ? 'bg-gradient-to-r from-sky-600 to-sky-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-lg opacity-80">%</span> Discounts
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'orders'
              ? 'bg-gradient-to-r from-orange-600 to-orange-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-lg opacity-80">#</span> Orders
          </button>

          <button
            onClick={() => setActiveTab('orderItems')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'orderItems'
              ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-sm opacity-80 font-black">LI</span> Order Items
          </button>

          <button
            onClick={() => setActiveTab('wallets')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'wallets'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-lg opacity-80">$</span> Wallets
          </button>

          <button
            onClick={() => setActiveTab('libraries')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'libraries'
              ? 'bg-gradient-to-r from-lime-600 to-lime-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-sm opacity-80 font-black">LB</span> Libraries
          </button>

          <button
            onClick={() => setActiveTab('wishlists')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'wishlists'
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-sm opacity-80 font-black">WL</span> Wishlists
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 font-bold ${activeTab === 'reviews'
              ? 'bg-gradient-to-r from-violet-600 to-violet-500 shadow-lg text-white'
              : 'text-gray-400 hover:bg-gray-750 hover:text-white'
              }`}
          >
            <span className="mr-3 text-sm opacity-80 font-black">RV</span> Reviews
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
              {adminMode === 'store' ? 'Store Mode' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
            <p className="text-gray-400 mt-1 font-medium">
              {adminMode === 'store'
                ? 'Customer storefront running under the signed-in admin account'
                : `Control panel for platform ${activeTab.replace(/([A-Z])/g, ' $1').trim()}`}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/40 text-blue-400 text-sm font-bold border border-blue-800/50">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              System Live
            </div>
          </div>
        </div>

        <div className="p-10">
          {adminMode === 'store' ? (
            <AdminStoreModePanel onBackToAdmin={() => setAdminMode('admin')} />
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-700 border-t-blue-500 border-b-purple-500"></div>
              <p className="text-gray-400 font-medium tracking-wider">Syncing Data...</p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {adminSuccess && (
                <div className="bg-green-500/10 border border-green-500 text-green-300 p-4 rounded-lg mb-6 font-medium">
                  {adminSuccess}
                </div>
              )}
              {adminError && (
                <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-lg mb-6 font-medium">
                  {adminError}
                </div>
              )}
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
              {/* Data Table Sections */}
              {(activeTab === 'platforms' ||
                activeTab === 'categories' ||
                activeTab === 'gameCategories' ||
                activeTab === 'gamePlatforms') && (
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
                          placeholder={`Search ${activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-shadow ${activeTab === 'platforms'
                            ? 'focus:border-red-500 focus:ring-red-500'
                            : activeTab === 'categories'
                              ? 'focus:border-yellow-500 focus:ring-yellow-500'
                              : activeTab === 'gameCategories'
                                ? 'focus:border-indigo-500 focus:ring-indigo-500'
                                : 'focus:border-teal-500 focus:ring-teal-500'
                            }`}
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (activeTab === 'platforms') openPlatformModal();
                          if (activeTab === 'categories') openCategoryModal();
                          if (activeTab === 'gameCategories') openGameCategoryModal();
                          if (activeTab === 'gamePlatforms') openGamePlatformModal();
                        }}
                        className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-lg text-sm font-bold shadow-lg transition-all text-white ${activeTab === 'platforms'
                          ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20'
                          : activeTab === 'categories'
                            ? 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-900/20'
                            : activeTab === 'gameCategories'
                              ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'
                              : 'bg-teal-600 hover:bg-teal-500 shadow-teal-900/20'
                          }`}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>

                        {activeTab === 'platforms' && 'Add New Platform'}
                        {activeTab === 'categories' && 'Add New Category'}
                        {activeTab === 'gameCategories' && 'Add New Game Category'}
                        {activeTab === 'gamePlatforms' && 'Add New Game Platform'}
                      </button>
                    </div>

                    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                          <thead>
                            <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                              <th className="px-6 py-4 w-16">ID</th>

                              <th className="px-6 py-4">
                                {activeTab === 'platforms' && 'Platform Information'}
                                {activeTab === 'categories' && 'Category Information'}
                                {activeTab === 'gameCategories' && 'Game Information'}
                                {activeTab === 'gamePlatforms' && 'Game Information'}
                              </th>

                              {(activeTab === 'gameCategories' ||
                                activeTab === 'gamePlatforms') && (
                                  <th className="px-6 py-4">
                                    {activeTab === 'gameCategories' && 'Category'}
                                    {activeTab === 'gamePlatforms' && 'Platform'}
                                  </th>
                                )}

                              <th className="px-6 py-4 text-right">Manage</th>
                            </tr>
                          </thead>

                          <tbody className="text-sm divide-y divide-gray-700">
                            {activeTab === 'platforms' &&
                              platformsList
                                .filter((p) => p.platformName.toLowerCase().includes(normalizedSearch))
                                .map((p) => (
                                  <tr key={p.platformId} className="hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                      {p.platformId}
                                    </td>

                                    <td className="px-6 py-4">
                                      <div className="flex flex-col">
                                        <span className="font-bold text-white text-base uppercase">
                                          {p.platformName}
                                        </span>
                                        <span className="text-gray-400 text-xs mt-0.5">
                                          Supported console platform
                                        </span>
                                      </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end space-x-2">
                                        <button
                                          onClick={() => openPlatformModal(p)}
                                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                          title="Edit Platform"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                        </button>

                                        <button
                                          onClick={() => deleteRecord(() => adminPlatformsApi.remove(p.platformId))}
                                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                          title="Delete Platform"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}

                            {activeTab === 'categories' &&
                              categoriesList
                                .filter((c) => c.categoryName.toLowerCase().includes(normalizedSearch))
                                .map((c) => (
                                  <tr key={c.categoryId} className="hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs w-16">
                                      {c.categoryId}
                                    </td>

                                    <td className="px-6 py-4">
                                      <div className="flex flex-col">
                                        <span className="font-bold text-white text-base">
                                          {c.categoryName}
                                        </span>
                                        <span className="text-gray-400 text-xs mt-0.5">
                                          Game content category
                                        </span>
                                      </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end items-center gap-2">
                                        <button
                                          onClick={() => openCategoryModal(c)}
                                          className="inline-flex items-center justify-center w-9 h-9 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                          title="Edit Category"
                                        >
                                          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                        </button>

                                        <button
                                          onClick={() => deleteRecord(() => adminCategoriesApi.remove(c.categoryId))}
                                          className="inline-flex items-center justify-center w-9 h-9 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                          title="Delete Category"
                                        >
                                          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}

                            {activeTab === 'gameCategories' &&
                              gameCategoriesList
                                .filter((gc) => {
                                  const gameTitle = gc.game?.title?.toLowerCase() || '';
                                  const categoryName = gc.category?.categoryName?.toLowerCase() || '';
                                  return gameTitle.includes(normalizedSearch) || categoryName.includes(normalizedSearch);
                                })
                                .map((gc) => (
                                  <tr key={`${gc.gameId}-${gc.categoryId}`} className="hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                      {gc.gameId}
                                    </td>

                                    <td className="px-6 py-4">
                                      <div className="flex flex-col">
                                        <span className="font-bold text-white text-base">
                                          {gc.game?.title || `Game #${gc.gameId}`}
                                        </span>
                                        <span className="text-gray-400 text-xs mt-0.5">
                                          Game ID: {gc.gameId}
                                        </span>
                                      </div>
                                    </td>

                                    <td className="px-6 py-4 text-indigo-400 font-black tracking-wider text-base">
                                      {gc.category?.categoryName || `Category #${gc.categoryId}`}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end space-x-2">
                                        <button
                                          onClick={() => openGameCategoryModal(gc)}
                                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                          title="Edit Game Category"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                        </button>

                                        <button
                                          onClick={() => deleteRecord(() => adminGameCategoriesApi.remove(gc.gameId, gc.categoryId))}
                                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                          title="Delete Game Category"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}

                            {activeTab === 'gamePlatforms' &&
                              gamePlatformsList
                                .filter((gp) => {
                                  const gameTitle = gp.game?.title?.toLowerCase() || '';
                                  const platformName = gp.platform?.platformName?.toLowerCase() || '';
                                  return gameTitle.includes(normalizedSearch) || platformName.includes(normalizedSearch);
                                })
                                .map((gp) => (
                                  <tr key={`${gp.gameId}-${gp.platformId}`} className="hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                      {gp.gameId}
                                    </td>

                                    <td className="px-6 py-4">
                                      <div className="flex flex-col">
                                        <span className="font-bold text-white text-base">
                                          {gp.game?.title || `Game #${gp.gameId}`}
                                        </span>
                                        <span className="text-gray-400 text-xs mt-0.5">
                                          Game ID: {gp.gameId}
                                        </span>
                                      </div>
                                    </td>

                                    <td className="px-6 py-4 text-teal-400 font-black tracking-wider text-base uppercase">
                                      {gp.platform?.platformName || `Platform #${gp.platformId}`}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end space-x-2">
                                        <button
                                          onClick={() => openGamePlatformModal(gp)}
                                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                          title="Edit Game Platform"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                        </button>

                                        <button
                                          onClick={() => deleteRecord(() => adminGamePlatformsApi.remove(gp.gameId, gp.platformId))}
                                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                          title="Delete Game Platform"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
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
                                {formatDate(u.createdAt)}
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
              {activeTab === 'dlcs' && (
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
                        placeholder="Search DLCs by name or game..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-shadow"
                      />
                    </div>

                    <button
                      onClick={() => openDLCModal()}
                      className="w-full sm:w-auto flex items-center justify-center bg-pink-600 hover:bg-pink-500 px-6 py-3 rounded-lg text-sm font-bold shadow-lg shadow-pink-900/20 transition-all text-white"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New DLC
                    </button>
                  </div>

                  <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                          <tr className="bg-gray-900 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-bold">
                            <th className="px-6 py-4 w-16">ID</th>
                            <th className="px-6 py-4">DLC Information</th>
                            <th className="px-6 py-4">Game</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Release Date</th>
                            <th className="px-6 py-4 text-right">Manage</th>
                          </tr>
                        </thead>

                        <tbody className="text-sm divide-y divide-gray-700">
                          {filteredDLCs.map((dlc) => (
                            <tr key={dlc.dlcId} className="hover:bg-gray-750 transition-colors">
                              <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                {dlc.dlcId}
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-white text-base">{dlc.name}</span>
                                  <span className="text-gray-400 text-xs mt-0.5">
                                    DLC Add-on Content
                                  </span>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border bg-blue-900/30 text-blue-400 border-blue-800/50">
                                  {dlc.game?.title || `Game #${dlc.gameId}`}
                                </span>
                              </td>

                              <td className="px-6 py-4">
                                <span className="text-pink-400 font-black tracking-wider text-base">
                                  {formatPrice(dlc.price)}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-gray-400 font-medium">
                                {formatDate(dlc.releaseDate)}
                              </td>

                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => openDLCModal(dlc)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                    title="Edit DLC"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>

                                  <button
                                    onClick={() => deleteRecord(() => adminDlcApi.remove(dlc.dlcId))}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                    title="Delete DLC"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {dlcsList.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium italic">
                                No DLC records found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && renderOrdersSection()}
              {activeTab === 'orderItems' && renderOrderItemsSection()}
              {activeTab === 'wallets' && renderWalletsSection()}
              {activeTab === 'libraries' && renderLibrariesSection()}
              {activeTab === 'wishlists' && renderWishlistsSection()}
              {activeTab === 'reviews' && renderReviewsSection()}
              {activeTab === 'discounts' && renderDiscountsSection()}
              {activeTab === 'editions' && renderEditionsSection()}
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
                <select
                  name="gameId"
                  value={relationFormData.gameId}
                  onChange={handleGenericChange(setRelationFormData)}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  required
                >
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
      {isDLCModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-2xl font-black text-white tracking-wide uppercase">
                {editingDLC ? 'Edit DLC' : 'Create DLC'}
              </h2>

              <button
                onClick={() => {
                  setIsDLCModalOpen(false);
                  setEditingDLC(null);
                  setDLCFormData(emptyDLCForm);
                }}
                className="text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleDLCSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  DLC Name
                </label>
                <input
                  name="name"
                  value={dlcFormData.name}
                  onChange={handleGenericChange(setDLCFormData)}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={dlcFormData.price}
                  onChange={handleGenericChange(setDLCFormData)}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Release Date (YYYY-MM-DD)
                </label>
                <input
                  name="releaseDate"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  pattern="\d{4}-\d{2}-\d{2}"
                  value={dlcFormData.releaseDate}
                  onChange={handleGenericChange(setDLCFormData)}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Parent Game
                </label>
                <select
                  name="gameId"
                  value={dlcFormData.gameId}
                  onChange={handleGenericChange(setDLCFormData)}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  required
                >
                  <option value="">Select Game</option>
                  {gamesList.map((game) => (
                    <option key={game.gameId} value={game.gameId}>
                      {game.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsDLCModalOpen(false);
                    setEditingDLC(null);
                    setDLCFormData(emptyDLCForm);
                  }}
                  className="px-6 py-3 text-sm font-bold text-gray-300 hover:text-white bg-transparent hover:bg-gray-700 rounded-lg transition-all border border-gray-600"
                >
                  Dismiss
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 text-sm flex items-center bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-bold shadow-lg shadow-pink-900/40 transition-all uppercase tracking-wider"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {editingDLC ? 'Update DLC' : 'Commit DLC'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDiscountModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-2xl font-black text-white tracking-wide uppercase">
                {editingDiscount ? 'Edit Discount' : 'Create Discount'}
              </h2>
              <button
                onClick={() => {
                  setIsDiscountModalOpen(false);
                  setEditingDiscount(null);
                  setDiscountFormData(emptyDiscountForm);
                }}
                className="text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleDiscountSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Game
                </label>
                <select
                  name="gameId"
                  value={discountFormData.gameId}
                  onChange={handleGenericChange(setDiscountFormData)}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  required
                >
                  <option value="">Select Game</option>
                  {gamesList.map((game) => (
                    <option key={game.gameId} value={game.gameId}>
                      {game.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Percentage
                </label>
                <input
                  name="percentage"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={discountFormData.percentage}
                  onChange={handleGenericChange(setDiscountFormData)}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Start Date
                  </label>
                  <input
                    name="startDate"
                    type="text"
                    placeholder="YYYY-MM-DD"
                    pattern="\d{4}-\d{2}-\d{2}"
                    value={discountFormData.startDate}
                    onChange={handleGenericChange(setDiscountFormData)}
                    className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    End Date
                  </label>
                  <input
                    name="endDate"
                    type="text"
                    placeholder="YYYY-MM-DD"
                    pattern="\d{4}-\d{2}-\d{2}"
                    value={discountFormData.endDate}
                    onChange={handleGenericChange(setDiscountFormData)}
                    className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsDiscountModalOpen(false);
                    setEditingDiscount(null);
                    setDiscountFormData(emptyDiscountForm);
                  }}
                  className="px-6 py-3 text-sm font-bold text-gray-300 hover:text-white bg-transparent hover:bg-gray-700 rounded-lg transition-all border border-gray-600"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm flex items-center bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold shadow-lg shadow-sky-900/40 transition-all uppercase tracking-wider"
                >
                  Save Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-2xl font-black text-white tracking-wide uppercase">
                {editingEdition ? 'Edit Edition' : 'Create Edition'}
              </h2>
              <button
                onClick={() => {
                  setIsEditionModalOpen(false);
                  setEditingEdition(null);
                  setEditionFormData(emptyEditionForm);
                }}
                className="text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditionSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Edition Name
                </label>
                <input
                  name="name"
                  value={editionFormData.name}
                  onChange={handleGenericChange(setEditionFormData)}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Game
                </label>
                <select
                  name="gameId"
                  value={editionFormData.gameId}
                  onChange={handleGenericChange(setEditionFormData)}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 focus:outline-none"
                  required
                >
                  <option value="">Select Game</option>
                  {gamesList.map((game) => (
                    <option key={game.gameId} value={game.gameId}>
                      {game.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editionFormData.price}
                  onChange={handleGenericChange(setEditionFormData)}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Includes
                </label>
                <textarea
                  name="includes"
                  value={editionFormData.includes}
                  onChange={handleGenericChange(setEditionFormData)}
                  rows={4}
                  className="w-full p-3 bg-gray-900 rounded-lg text-white border border-gray-700 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditionModalOpen(false);
                    setEditingEdition(null);
                    setEditionFormData(emptyEditionForm);
                  }}
                  className="px-6 py-3 text-sm font-bold text-gray-300 hover:text-white bg-transparent hover:bg-gray-700 rounded-lg transition-all border border-gray-600"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm flex items-center bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-bold shadow-lg shadow-fuchsia-900/40 transition-all uppercase tracking-wider"
                >
                  Save Edition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
