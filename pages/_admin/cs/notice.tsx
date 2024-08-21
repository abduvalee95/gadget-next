import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { NoticeList } from '../../../libs/components/admin/cs/NoticeList';
import { Notice } from '../../../libs/types/notice/notice';
import { REMOVE_NOTICE_BY_ADMIN, UPDATE_NOTICE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';

import { T } from '../../../libs/types/common';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { NoticeCategory, NoticeStatus } from '../../../libs/enums/notice.enum';
import { NoticeUpdate } from '../../../libs/types/notice/notice.update';
import router from 'next/router';

import { GET_NOTICE } from '../../../apollo/admin/query'
import { AllNoticesInquiry } from '../../../libs/types/notice/notice.input'

const AdminNotice: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<any>([]);
	const [noticesInquiry, setNoticesInquiry] = useState<AllNoticesInquiry>(initialInquiry);
	const [notices, setNotices] = useState<Notice[]>([]);
	const [noticeTotal, setNoticeTotal] = useState<number>(0);
	const [value, setValue] = useState(
		noticesInquiry?.search?.noticeStatus ? noticesInquiry?.search?.noticeStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateFaqByAdmin] = useMutation(UPDATE_NOTICE_BY_ADMIN);
	const [removeFaqByAdmin] = useMutation(REMOVE_NOTICE_BY_ADMIN);

	const {
		loading: getAllNoticesByAdminLoading,
		data: getAllNoticesByAdminData,
		error: getAllNoticesByAdminError,
		refetch: getAllNoticesByAdminsRefetch,
	} = useQuery(GET_NOTICE, {
		fetchPolicy: 'network-only',
		variables: { input: noticesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotices(data?.getAllNoticesByAdmin?.list);
			setNoticeTotal(data?.getAllNoticesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllNoticesByAdminsRefetch({ input: noticesInquiry }).then();
	}, [noticesInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		noticesInquiry.page = newPage + 1;
		await getAllNoticesByAdminsRefetch({ input: noticesInquiry });
		setNoticesInquiry({ ...noticesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		noticesInquiry.limit = parseInt(event.target.value, 10);
		noticesInquiry.page = 1;
		await getAllNoticesByAdminsRefetch({ input: noticesInquiry });
		setNoticesInquiry({ ...noticesInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setNoticesInquiry({ ...noticesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.ACTIVE } });
				break;
			case 'DELETE':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.DELETE } });
				break;
			default:
				delete noticesInquiry?.search?.noticeStatus;
				setNoticesInquiry({ ...noticesInquiry });
				break;
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setNoticesInquiry({
					...noticesInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...noticesInquiry.search,
						noticeCategory: newValue as NoticeCategory,
					},
				});
			} else {
				delete noticesInquiry?.search?.noticeCategory;
				setNoticesInquiry({ ...noticesInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateNoticeHandler = async (updateData: NoticeUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateFaqByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllNoticesByAdminsRefetch({ input: noticesInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	const removeNoticeHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('are you sure to remove?')) {
				await removeFaqByAdmin({
					variables: {
						input: id,
					},
				});
			}
			await getAllNoticesByAdminsRefetch({ input: noticesInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const handleAddButtonClick = () => {
		router.push('/_admin/cs/notice_create');
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTextHandler = () => {
		try {
			setNoticesInquiry({
				...noticesInquiry,
				search: {
					...noticesInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	console.log('+noticesInquiry', noticesInquiry);
	console.log('+notices', notices);

	return (
		// @ts-ignore
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Notice Management</Typography>
				<Button
					className="btn_add"
					style={{ background: '#34cc99', color: '#fff' }}
					size={'medium'}
					onClick={handleAddButtonClick}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD
				</Button>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={'value'}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'all')}
									value="all"
									className={'all' === 'all' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'active')}
									value="active"
									className={'all' === 'all' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'deleted')}
									value="deleted"
									className={'all' === 'all' ? 'li on' : 'li'}
								>
									Deleted
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(NoticeCategory).map((category: string) => (
										<MenuItem value={category} onClick={() => searchTypeHandler(category)} key={category}>
											{category}
										</MenuItem>
									))}
								</Select>
								<OutlinedInput
									value={searchText}
									onChange={(e) => textHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search user name"
									onKeyDown={(event) => {
										if (event.key == 'Enter') searchTextHandler();
									}}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon
													onClick={async () => {
														setSearchText('');
														setNoticesInquiry({ ...noticesInquiry, search: { ...noticesInquiry.search, text: '' } });
													}}
												/>
											)}
											<InputAdornment position="end" onClick={() => searchTextHandler()}>
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>
						<NoticeList
							notices={notices}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateNoticeHandler={updateNoticeHandler}
							removeNoticeHandler={removeNoticeHandler}
							// membersData={membersData}
							// searchMembers={searchMembers}
							anchorEl={anchorEl}
							// generateMentorTypeHandle={generateMentorTypeHandle}
						/>

						<TablePagination
							rowsPerPageOptions={[20, 40, 60]}
							component="div"
							count={4}
							rowsPerPage={10}
							page={1}
							onPageChange={() => {}}
							onRowsPerPageChange={() => {}}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminNotice.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(AdminNotice);
