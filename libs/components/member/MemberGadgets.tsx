import { useQuery } from '@apollo/client';
import { Pagination, Stack, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GET_PROPERTY} from '../../../apollo/user/query';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { T } from '../../types/common';
import { Gadget } from '../../types/gadget/gadget';
import { GadgetsInquiry } from '../../types/gadget/gadget.input';
import { GadgetCard } from '../mypage/GadgetCard';

const MyGadgets: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<GadgetsInquiry>({ ...initialInput });
	const [agentGadgets, setAgentGadgets] = useState<Gadget[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getGadgetsLoadig,
		data: getGadgetsData,
		error: getGadgetsError,
		refetch: getGadgetsRefetch,
	} = useQuery(GET_PROPERTY, {
		fetchPolicy: 'network-only', // faqat backendga murojat qiladi
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentGadgets(data?.getGadgets?.list);
			setTotal(data?.getGadgets?.metaCounter[0]?.total);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		getGadgetsRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>NESTAR GADGETS MOBILE</div>;
	} else {
		return (
			<div id="member-gadgets-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Gadgets</Typography>
					</Stack>
				</Stack>
				<Stack className="properties-list-box">
					<Stack className="list-box">
						{agentGadgets?.length > 0 && (
							<Stack className="listing-title-box">
								<Typography className="title-text">Listing title</Typography>
								<Typography className="title-text">Date Published</Typography>
								<Typography className="title-text">Status</Typography>
								<Typography className="title-text">View</Typography>
							</Stack>
						)}
						{agentGadgets?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Gadget found!</p>
							</div>
						)}
						{agentGadgets?.map((gadget: Gadget) => {
							return <GadgetCard gadget={gadget} memberPage={true} key={gadget?._id} />;
						})}

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
			memberId: '',
		},
	},
};

export default MyGadgets;
