import { useMutation, useQuery } from '@apollo/client';
import { TabContext } from '@mui/lab';
import { Box, List, ListItem, Stack } from '@mui/material';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { REMOVE_GADGET_BY_ADMIN, UPDATE_GADGET_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_PROPERTIES_BY_ADMIN } from '../../../apollo/admin/query';
import { GadgetPanelList } from '../../../libs/components/admin/gadgets/GadgetList';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { GadgetLocation, GadgetStatus } from '../../../libs/enums/gadget.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { Gadget } from '../../../libs/types/gadget/gadget';
import { AllGadgetsInquiry } from '../../../libs/types/gadget/gadget.input';
import { GadgetUpdate } from '../../../libs/types/gadget/gadget.update';

const AdminGadgets: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [gadgetsInquiry, setGadgetsInquiry] = useState<AllGadgetsInquiry>(initialInquiry);
	const [gadgets, setGadgets] = useState<Gadget[]>([]);
	const [gadgetsTotal, setGadgetsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		gadgetsInquiry?.search?.gadgetStatus ? gadgetsInquiry?.search?.gadgetStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateGadgetByAdmin] = useMutation(UPDATE_GADGET_BY_ADMIN);
	const [removeGadgetByAdmin] = useMutation(REMOVE_GADGET_BY_ADMIN);

	const {
		loading: getAllGadgetsByAdminLoading,
		data: getAllGadgetsByAdminData,
		error: getAllGadgetsByAdminError,
		refetch: getAllGadgetsByAdminRefetch,
	} = useQuery(GET_ALL_PROPERTIES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: gadgetsInquiry,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setGadgets(data?.getAllGadgetsByAdmin?.list);
			setGadgetsTotal(data?.getAllGadgetsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllGadgetsByAdminRefetch({ input: gadgetsInquiry }).then();
	}, [gadgetsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		gadgetsInquiry.page = newPage + 1;
		await getAllGadgetsByAdminRefetch({ input: gadgetsInquiry });
		setGadgetsInquiry({ ...gadgetsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		gadgetsInquiry.limit = parseInt(event.target.value, 10);
		gadgetsInquiry.page = 1;
		await getAllGadgetsByAdminRefetch({ input: gadgetsInquiry });
		setGadgetsInquiry({ ...gadgetsInquiry });
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

		setGadgetsInquiry({ ...gadgetsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setGadgetsInquiry({ ...gadgetsInquiry, search: { gadgetStatus: GadgetStatus.ACTIVE } });
				break;
			case 'SOLD':
				setGadgetsInquiry({ ...gadgetsInquiry, search: { gadgetStatus: GadgetStatus.SOLD } });
				break;
			case 'DELETE':
				setGadgetsInquiry({ ...gadgetsInquiry, search: { gadgetStatus: GadgetStatus.DELETE } });
				break;
			default:
				delete gadgetsInquiry?.search?.gadgetStatus;
				setGadgetsInquiry({ ...gadgetsInquiry });
				break;
		}
	};

	const removeGadgetHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeGadgetByAdmin({
					variables: {
						input: id,
					},
				});
				await getAllGadgetsByAdminRefetch({ input: gadgetsInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setGadgetsInquiry({
					...gadgetsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...gadgetsInquiry.search,
						gadgetLocationList: [newValue as GadgetLocation],
					},
				});
			} else {
				delete gadgetsInquiry?.search?.gadgetLocationList;
				setGadgetsInquiry({ ...gadgetsInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateGadgetHandler = async (updateData: GadgetUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateGadgetByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllGadgetsByAdminRefetch({ input: gadgetsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Gadget List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e:any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e:any) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e:any) => tabChangeHandler(e, 'SOLD')}
									value="SOLD"
									className={value === 'SOLD' ? 'li on' : 'li'}
								>
									Sold
								</ListItem>
								<ListItem
									onClick={(e:any) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(GadgetLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<GadgetPanelList
							gadgets={gadgets}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateGadgetHandler={updateGadgetHandler}
							removeGadgetHandler={removeGadgetHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={gadgetsTotal}
							rowsPerPage={gadgetsInquiry?.limit}
							page={gadgetsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminGadgets.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminGadgets);
