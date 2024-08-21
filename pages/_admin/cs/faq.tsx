import React, { useEffect, useState } from 'react';
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
import { FaqArticlesPanelList } from '../../../libs/components/admin/cs/FaqList';
import { REMOVE_FAQ_BY_ADMIN, UPDATE_FAQ_BY_ADMIN } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';

import { T } from '../../../libs/types/common';
import { AllFaqsInquiry } from '../../../libs/types/faq/faq.input';
import { FaqCategory, FaqStatus } from '../../../libs/enums/faq.enum';
import { FaqUpdate } from '../../../libs/types/faq/faq.update';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import router from 'next/router';
import { FaqType } from '../../../libs/types/faq/faq';
import { GET_ALL_FAQS_BY_ADMIN } from '../../../apollo/admin/query'

const FaqArticles: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<any>([]);
	const [faqsInquiry, setFaqsInquiry] = useState<AllFaqsInquiry>(initialInquiry);
	const [faqs, setFaqs] = useState<FaqType[]>([]);
	const [faqTotal, setFaqTotal] = useState<number>(0);
	const [value, setValue] = useState(faqsInquiry?.search?.faqStatus ? faqsInquiry?.search?.faqStatus : 'ALL');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateFaqByAdmin] = useMutation(UPDATE_FAQ_BY_ADMIN);
	const [removeFaqByAdmin] = useMutation(REMOVE_FAQ_BY_ADMIN);

	const {
		loading: getAllFaqsByAdminLoading,
		data: getAllFaqsByAdminData,
		error: getAllFaqsByAdminError,
		refetch: getAllFaqsByAdminsRefetch,
	} = useQuery(GET_ALL_FAQS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: faqsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFaqs(data?.getAllFaqsByAdmin?.list);
			setFaqTotal(data?.getAllFaqsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllFaqsByAdminsRefetch({ input: faqsInquiry }).then();
	}, [faqsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		faqsInquiry.page = newPage + 1;
		await getAllFaqsByAdminsRefetch({ input: faqsInquiry });
		setFaqsInquiry({ ...faqsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		faqsInquiry.limit = parseInt(event.target.value, 10);
		faqsInquiry.page = 1;
		await getAllFaqsByAdminsRefetch({ input: faqsInquiry });
		setFaqsInquiry({ ...faqsInquiry });
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

		setFaqsInquiry({ ...faqsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setFaqsInquiry({ ...faqsInquiry, search: { faqStatus: FaqStatus.ACTIVE } });
				break;
			case 'DELETE':
				setFaqsInquiry({ ...faqsInquiry, search: { faqStatus: FaqStatus.DELETE } });
				break;
			default:
				delete faqsInquiry?.search?.faqStatus;
				setFaqsInquiry({ ...faqsInquiry });
				break;
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setFaqsInquiry({
					...faqsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...faqsInquiry.search,
						faqCategory: newValue as FaqCategory,
					},
				});
			} else {
				delete faqsInquiry?.search?.faqCategory;
				setFaqsInquiry({ ...faqsInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateFaqHandler = async (updateData: FaqUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateFaqByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllFaqsByAdminsRefetch({ input: faqsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	const removeFaqHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('are you sure to remove?')) {
				await removeFaqByAdmin({
					variables: {
						input: id,
					},
				});
			}
			await getAllFaqsByAdminsRefetch({ input: faqsInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const handleAddButtonClick = () => {
		router.push('/_admin/cs/faq_create');
	};

	console.log('+faqsInquiry', faqsInquiry);
	console.log('+faqs', faqs);

	return (
		// @ts-ignore
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>FAQ Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					style={{ background: '#34cc99', color: '#fff' }}
					// onClick={() => router.push(`/_admin/cs/faq_create`)}
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
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="all"
									className={'all' === 'all' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
									value="active"
									className={'all' === 'all' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'DELETE')}
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
									{Object.values(FaqCategory).map((category: string) => (
										<MenuItem value={category} onClick={() => searchTypeHandler(category)} key={category}>
											{category}
										</MenuItem>
									))}
								</Select>

								<OutlinedInput
									value={'searchInput'}
									// onChange={(e) => handleInput(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search user name"
									onKeyDown={(event) => {
										// if (event.key == 'Enter') searchTargetHandler().then();
									}}
									endAdornment={
										<>
											{true && <CancelRoundedIcon onClick={() => {}} />}
											<InputAdornment position="end" onClick={() => {}}>
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>
						<FaqArticlesPanelList
							faqs={faqs}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateFaqHandler={updateFaqHandler}
							removeFaqHandler={removeFaqHandler}
							// membersData={membersData}
							// searchMembers={searchMembers}

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

FaqArticles.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(FaqArticles);
