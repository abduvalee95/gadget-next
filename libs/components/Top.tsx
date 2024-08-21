import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Logout } from '@mui/icons-material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Badge, Box, IconButton, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter, withRouter } from 'next/router';
import { CaretDown } from 'phosphor-react';
import React, { useCallback, useEffect, useState } from 'react';
import { GET_NOTIFICATIONS } from '../../apollo/admin/query';
import { userVar } from '../../apollo/store';
import { UPDATE_NOTIFICATION } from '../../apollo/user/mutation';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { REACT_APP_API_URL } from '../config';
import { NotificationStatus } from '../enums/notification.enum';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { T } from '../types/common';
import { Notification } from '../types/notifications/notifications';

interface GetNotificationsProps {
	initialInput: String;
}

const Top = (props: any) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
	const [getuNotifications, setGetNotifications] = useState<Notification[]>([]);
	const notificationOpen = Boolean(notificationAnchor);

	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);

	/** APOLLO REQUESTS **/
	const {
		loading: getNotificationsLoading,
		data: getNotificationsData,
		error: getNotificationsError,
		refetch: getNotificationsRefetch,
	} = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: user._id },
		skip: !user?._id,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setGetNotifications(data?.getNotification);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/gadget/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	// Notification

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	/* NOTIFICATION HANDLER */

	const handleNotificationClick = (event: any) => {
		setNotificationAnchor(event.currentTarget);
	};

	const handleNotificationClose = () => {
		setNotificationAnchor(null);
	};

	const handleNotificationRead = async (notification: Notification) => {
		await updateNotification({
			variables: { input: { _id: notification._id, notificationStatus: NotificationStatus.READ } },
		});
		getNotificationsRefetch();
		router.push(
			notification.notificationGroup === 'ARTICLE'
				? `/community/detail?articleCategory=FREE&id=${notification.articleId}`
				: notification.notificationGroup === 'GADGET'
				? `gadget/detail?id=${notification.gadgetId}`
				: notification.notificationGroup === 'MEMBER'
				? `/agent/detail?agentId=${notification.receiverId}`
				: '/',
		); // Default route if none match
	};

	console.log('notifications: ', getuNotifications);
	const unreadNotifications = getuNotifications.filter((notification) => notification.notificationStatus === 'WAIT');

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 13,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/gadget'}>
					<div>{t('Gadgets')}</div>
				</Link>
				<Link href={'/agent'}>
					<div> {t('Seller')} </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {t('Community')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {t('CS')} </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img src="/img/logo/apple1.svg" alt="" />
							</Link>
						</Box>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div>{t('Home')}</div>
							</Link>
							<Link href={'/gadget'}>
								<div>{t('Gadgets')}</div>
							</Link>
							<Link href={'/agent'}>
								<div> {t('Sellers')} </div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div> {t('Community')} </div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div> {t('My Page')} </div>
								</Link>
							)}
							<Link href={'/cs'}>
								<div> {t('CS')} </div>
							</Link>
						</Box>
						<Box component={'div'} className={'user-box'}>
							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<AccountCircleOutlinedIcon />
										<span>
											{t('Sign-In')} Or {t('Register')}
										</span>
									</div>
								</Link>
							)}
							<div className={'lan-box'}>
								{/* Notification Start */}
								{user?._id && (
									<>
										<IconButton className={'icon-cala'} onClick={handleNotificationClick}>
											<Badge badgeContent={unreadNotifications.length} color="error">
												<NotificationsOutlinedIcon className={'notification-icon'} />
											</Badge>
										</IconButton>
										<Menu
											anchorEl={notificationAnchor}
											open={notificationOpen}
											onClose={handleNotificationClose}
											PaperProps={{
												elevation: 1,
												sx: {
													marginTop: '10px',
													minWidth: '300px',
													width: '400px',
													background: 'none',
													borderRadius: '22px',
													maxHeight: '200px',
													overflowY: 'auto',
												},
											}}
											MenuListProps={{
												sx: {
													padding: 0,
												},
											}}
										>
											{getuNotifications.length === 0 ? (
												<MenuItem
													sx={{
														display: 'flex',
														flexDirection: 'column',
														alignItems: 'center',
														justifyContent: 'center',
														color: '#fff',
														height: '100px',
													}}
												>
													{t('No new notifications')}
												</MenuItem>
											) : (
												getuNotifications.map((notification: any) => (
													<MenuItem
														key={notification._id}
														className={'notification-items'}
														onClick={() => handleNotificationRead(notification)}
														sx={{
															display: 'flex',
															flexDirection: 'column',
															alignItems: 'flex-start',
															backgroundColor:
																notification.notificationStatus === NotificationStatus.WAIT ? '#331383' : '#838383',
															'&:hover': {
																backgroundColor:
																	notification.notificationStatus === NotificationStatus.WAIT
																		? '#2600ff7c'
																		: '#ff000079',
															},
															borderRadius: '10px',
															marginBottom: '7px',
															padding: '15px 20px',
															transition: 'background-color 0.4s ease',
														}}
													>
														<div>
															<Typography
																variant="subtitle1"
																sx={{
																	fontWeight: '700',
																	fontFamily: 'Nunito',
																	fontSize: '16px',
																	display: 'flex',
																	flexDirection: 'row',
																	alignItems: 'center',
																}}
															>
																<NotificationsActiveIcon
																	sx={{ fontSize: '16px', marginRight: '3px', color: '#e50b0b' }}
																/>{' '}
																{notification.notificationTitle}
															</Typography>
															<Typography
																variant="body2"
																sx={{ margin: '0.5px 0', fontFamily: 'Nunito', fontSize: '15px' }}
															>
																{notification.notificationDesc}
															</Typography>
															<Typography variant="caption" sx={{ color: 'gray' }}>
																{notification.createdAt}
															</Typography>
														</div>
													</MenuItem>
												))
											)}
										</Menu>
									</>
								)}
							{/* End NOtification */}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={12} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'usaFlag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'usaFlag'} />
										)}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/>
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="uz"
											alt={'koreanFlag'}
										/>
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="ru"
											alt={'russiaFlag'}
										/>
										{t('Russian')}
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};
export default withRouter(Top);
