import React, { SyntheticEvent, useEffect, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { FaqInquiry } from '../../types/faq/faq.input'
import { FaqType } from '../../types/faq/faq'
import { FaqCategory } from '../../enums/faq.enum';
import { useQuery } from '@apollo/client'
import { GET_FAQS } from '../../../apollo/user/query'
import { T } from '../../types/common'

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = ({initialFaq, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [faqCategory, setFaqCategory] = useState<FaqCategory>(FaqCategory.GADGET);
	const [expanded, setExpanded] = useState<string | false>('panel1');
	const [faqInquiry, setFaqInquiry] = useState<FaqInquiry>({ ...initialFaq, faqCategory });
	const [propertyFaqs, setPropertyFaqs] = useState<FaqType[]>([]);
	const [faqTotal, setFaqTotal] = useState<number>(0)

	/** APOLLO REQUESTS **/
	const {
		loading: getFaqsLoading,
		data: getFaqsData,
		error: getFaqsError,
		refetch: getFaqsRefetch,
	} = useQuery(GET_FAQS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialFaq },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPropertyFaqs(data?.getFaqs?.list);
			setFaqTotal(data?.getFaqs?.metaCounter[0]?.total);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		if (faqInquiry) {
			getFaqsRefetch({ input: faqInquiry });
		}
	}, [faqInquiry, getFaqsRefetch]);

	/** HANDLERS **/
	const changeCategoryHandler = (category: FaqCategory) => {
		setFaqCategory(category);
		setFaqInquiry((prev: any) => ({ ...prev, faqCategory: category }));
	};
	
	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};
	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div
							className={faqCategory === FaqCategory.PAYMENTS ? 'active' : ''}
							onClick={() => {
								changeCategoryHandler(FaqCategory.PAYMENTS);
							}}
					>
					Payment
					</div>
					<div
					className={faqCategory === FaqCategory.BUYERS ? 'active' : ''}
					onClick={() => {
						changeCategoryHandler(FaqCategory.BUYERS);
					}}
					>
							Foy Buyers
					</div>
					<div
						className={faqCategory === FaqCategory.GADGET ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler(FaqCategory.GADGET);
						}}
					>
						Gadget
					</div>
					<div
						className={faqCategory === FaqCategory.AGENTS ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler(FaqCategory.AGENTS);
						}}
					>
						For Sellers
					</div>
					<div
					className={faqCategory === FaqCategory.MEMBERSHIP ? 'active' : ''}
					onClick={() => {
						changeCategoryHandler(FaqCategory.MEMBERSHIP);
					}}
					>
						Membership
					</div>
					<div
						className={faqCategory === FaqCategory.COMMUNITY ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler(FaqCategory.COMMUNITY);
						}}
					>
						Community
					</div>
					<div
						className={faqCategory === FaqCategory.OTHER ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler(FaqCategory.OTHER);
						}}
					>
						Other
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{propertyFaqs &&
						propertyFaqs.map((ele: any) => (
							<Accordion expanded={expanded === ele?.id} onChange={handleChange(ele?.id)} key={ele?._id}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										Q
									</Typography>
									<Typography> {ele?.faqTitle}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											A
										</Typography>
										<Typography> {ele?.faqContent}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}
};

Faq.defaultProps = {
	initialFaq: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
	},
};
export default Faq;
