import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Pagination, Stack, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { userVar } from '../../../apollo/store';
import { UPDATE_GADGET } from '../../../apollo/user/mutation';
import { GadgetStatus } from '../../enums/gadget.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import { T } from '../../types/common';
import { Gadget } from '../../types/gadget/gadget';
import { GET_AGENT_PROPERTIES } from '../../../apollo/user/query'
import { GadgetCard } from './GadgetCard'
import { SellerGadgetsInquiry } from '../../types/gadget/gadget.input'

const MyGadgets: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<SellerGadgetsInquiry>(initialInput);
	const [agentGadgets, setAgentGadgets] = useState<Gadget[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateGadget] = useMutation(UPDATE_GADGET);

	const {
		loading: getAgentGadgetsLoading,
		data: getAgentGadgetsData,
		error: getAgentGadgetsError,
		refetch: getAgentGadgetsRefetch,
	} = useQuery(GET_AGENT_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentGadgets(data?.getAgentGadgets?.list);
			setTotal(data?.getAgentGadgets?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: GadgetStatus) => {
		setSearchFilter({ ...searchFilter, search: { gadgetStatus: value } });
	};

	const deleteGadgetHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are You Sure To Delete ?')) {
				await updateGadget({
					variables: {
						input: {
							_id: id,
							gadgetStatus: 'DELETE',
						},
					},
				});
				await getAgentGadgetsRefetch({ input: searchFilter });
			}
		} catch (error: any) {
			await sweetErrorHandling(error);
		}
	};

	const updateGadgetHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are You Sure To Change ${status} Status ?`)) {
				await updateGadget({
					variables: {
						input: {
							_id: id,
							gadgetStatus: status,
						},
					},
				});
				await getAgentGadgetsRefetch({ input: searchFilter });
			}
		} catch (error: any) {
			await sweetErrorHandling(error);
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>GADGETS MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Gadgets</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(GadgetStatus.ACTIVE)}
							className={searchFilter.search.gadgetStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							On Sale
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(GadgetStatus.SOLD)}
							className={searchFilter.search.gadgetStatus === 'SOLD' ? 'active-tab-name' : 'tab-name'}
						>
							On Sold
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.gadgetStatus === 'ACTIVE' && (
								<Typography className="title-text">Action</Typography>
							)}{' '}
						</Stack>

						{agentGadgets?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Gadget found!</p>
							</div>
						) : (
							agentGadgets.map((gadget: Gadget) => {
								return (
									<GadgetCard
										gadget={gadget}
										deleteGadgetHandler={deleteGadgetHandler}
										updateGadgetHandler={updateGadgetHandler}
									/>
								);
							})
						)}

						{agentGadgets.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} gadget available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyGadgets.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			gadgetStatus: 'ACTIVE',
		},
	},
};

export default MyGadgets;
