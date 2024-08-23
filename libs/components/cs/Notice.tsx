import { useQuery } from '@apollo/client';
import { Box, Stack } from '@mui/material';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { GET_NOTICE } from '../../../apollo/admin/query';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { T } from '../../types/common';
import { NoticeInput, NoticesInquiry } from '../../types/notice/notice.input';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum'


const Notice: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [total, setTotal] = useState<number>(0);
	const [noticeInquiry, setNoticeInquity] = useState<NoticesInquiry>(initialInput);
	const [getNotices, setGetNotices] = useState<NoticeInput[]>([]);

	/** APOLLO REQUESTS **/
  const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
} = useQuery(GET_NOTICE, {
		fetchPolicy: 'network-only',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data:T) => {
				setGetNotices(data?.getNotices?.list);
				setTotal(data?.getNotices?.metaCounter[0]?.total || 0);
		},
});
console.log("getNotivce",getNotices)
	/** LIFECYCLES **/
	useEffect(() => {
		if (noticeInquiry) {
			getNoticesRefetch({ input: noticeInquiry });
		}
	}, [noticeInquiry, getNoticesRefetch]);

	/** HANDLERS **/

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span>number</span>
						<span>title</span>
						<span>date</span>
					</Box>
					<Stack className={'bottom'}>
						{getNotices.map((ele: any,index:any) => (
							<div className={`notice-card ${ele?.event && 'event'}`} key={ele.noticeContent}>
								{ele?.noticeContent ? <div>event</div> : <span className={'notice-number'}>{index}</span>}
								<span className={'notice-title'}>{ele.noticeTitle}</span>
								<span className={'notice-title'}>{ele.noticeContent }</span>
								<span className={'notice-date'}>{ele.createdAt}</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

Notice.defaultProps = {
	initialInput:{
		page: 1,
		limit: 3,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
		'noticeCategory': 'TERMS'
			},
	}
}

export default Notice;
