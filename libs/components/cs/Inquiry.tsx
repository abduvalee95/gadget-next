import React, { useEffect, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router'
import { NoticesInquiry } from '../../types/notice/notice.input'
import { Notice } from '../../types/notice/notice'
import { useQuery } from '@apollo/client'
import { GET_NOTICE } from '../../../apollo/admin/query'
import { T } from '../../types/common'

const Inquiry = ({ initialNotice, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [noticeInquiry, setNoticeInquity] = useState<NoticesInquiry>(initialNotice);
	const [propertyNotices, setPropertyNotices] = useState<Notice[]>([]);
	const [noticeTotal, setNoticeTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
	} = useQuery(GET_NOTICE, {
		fetchPolicy: 'network-only',
		variables: { input: initialNotice },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPropertyNotices(data?.getNotices?.list);
			setNoticeTotal(data?.getNotices?.metaCounter[0]?.total);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		if (noticeInquiry) {
			getNoticesRefetch({ input: noticeInquiry });
		}
	}, [noticeInquiry, getNoticesRefetch]);

	/** HANDLERS **/

	if (device === 'mobile') {
		return <div>Inquiry MOBILE</div>;
	} else {
		return <div>Inquiry PC</div>;
	}
};

export default Inquiry;
