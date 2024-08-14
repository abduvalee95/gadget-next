import { useMutation, useQuery } from '@apollo/client';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import Filter from '../../libs/components/gadget/Filter';
import GadgetCard from '../../libs/components/gadget/GadgetCard';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Direction, Message } from '../../libs/enums/common.enum';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { T } from '../../libs/types/common';
import { Gadget } from '../../libs/types/gadget/gadget';
import { GadgetsInquiry } from '../../libs/types/gadget/gadget.input';
import { GET_PROPERTIES } from '../../apollo/user/query'

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const GadgetList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<GadgetsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [gadgets, setGadgets] = useState<Gadget[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	/** APOLLO REQUESTS **/
	const [likeTargetGadget] = useMutation(LIKE_TARGET_PROPERTY);

	//todo
	const {
		loading: getGadgetsLoading,
		data: getGadgetsData,
		error: getGadgetsError,
		refetch: getGadgetsRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only', // faqat backendga murojat qiladi
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setGadgets(data?.getGadgets?.list);
			setTotal(data?.getGadgets?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		console.log('searchFilter', searchFilter); //
		getGadgetsRefetch({ input: searchFilter }).then(); //  Backenddan refetch qilish : lekin shart emas triger boladi inputda berilgan
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/gadget?input=${JSON.stringify(searchFilter)}`,
			`/gadget?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'gadgetPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'gadgetPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	/** Like **/

	const likeGadgetHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetGadget({ variables: { input: id } });

			await getGadgetsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (error: any) {
			console.log('Error, LikeTopGadgets:', error.message);
			sweetMixinErrorAlert(error.message).then();
		}
	};

	if (device === 'mobile') {
		return <h1>GADGETS MOBILE</h1>;
	} else {
		return (
			<div id="property-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack className={'property-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Box component={'div'} className={'right'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									New
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Lowest Price
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Highest Price
								</MenuItem>
							</Menu>
						</div>
					</Box>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{gadgets?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Gadgets found!</p>
									</div>
								) : (
									gadgets.map((gadget: Gadget) => {
										return (
											<GadgetCard gadget={gadget} key={gadget?._id} likeGadgetHandler={likeGadgetHandler} />
										);
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{gadgets.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{gadgets.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} Gadget{total > 1 ? 's' : 'y'} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

GadgetList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 3,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
		/* 	squaresRange: {
				start: 0,
				end: 500,
			}, */
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(GadgetList);
