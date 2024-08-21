import DeleteIcon from '@mui/icons-material/Delete';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import {
	Box,
	Button,
	Fade,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FaqStatus } from '../../../enums/faq.enum';
import { FaqType } from '../../../types/faq/faq';

interface Data {
	category: string;
	title: string;
	writer: string;
	date: string;
	status: string;
	id?: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},

	{
		id: 'writer',
		numeric: true,
		disablePadding: false,
		label: 'CONTENT',
	},
	{
		id: 'date',
		numeric: true,
		disablePadding: false,
		label: 'DATE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface FaqArticleListProps {
	faqs: FaqType[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateArticleHandler: any;
	removeArticleHandler: any;
	membersData: any;
}

interface FaqArticlesPanelList {
	dense?: boolean;
	faqs: FaqType[];
	membersData?: any;
	searchMembers?: any;
	removeFaqHandler: any;
	updateFaqHandler: any;
	anchorEl?: any;
	menuIconClickHandler: any;
	handleMenuIconClick?: any;
	menuIconCloseHandler?: any;
	generateMentorTypeHandle?: any;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelList) => {
	const { dense, faqs, removeFaqHandler, menuIconClickHandler, updateFaqHandler, menuIconCloseHandler, anchorEl } =
		props;
	const router = useRouter();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{faqs.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}
						{faqs.length !== 0 &&
							faqs.map((faq: FaqType, index: number) => (
								<TableRow hover key={faq._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">{faq.faqCategory}</TableCell>
									<TableCell align="left">
										<Box component={'div'}>
											{faq.faqTitle}
											{faq.faqStatus === FaqStatus.ACTIVE && (
												<Link href={`/cs/${faq.faqCategory}&id=${faq._id}`} className={'img_box'}>
													<IconButton className="btn_window">
														<Tooltip title={'Open window'}>
															<OpenInBrowserRoundedIcon />
														</Tooltip>
													</IconButton>
												</Link>
											)}
										</Box>
									</TableCell>
									<TableCell align="left">{faq.faqContent}</TableCell>
									<TableCell align="left" className={'name'}>
										{faq.faqStatus === FaqStatus.ACTIVE ? (
											<Stack direction={'row'}>
												<Link href={`/faq/detail?id=${faq?._id}`}>
													{/* <div>
															<Avatar alt="Remy Sharp" src={faqImage} sx={{ ml: '2px', mr: '10px' }} />
														</div> */}
												</Link>
												<Link href={`/faq/detail?id=${faq?._id}`}>
													{/* <div>{faq.createdAt}</div> */}
													{/* <div>{formatDate(faq.createdAt)}</div> */}
												</Link>
											</Stack>
										) : (
											<Stack direction={'row'}>
												{/* <div>
														<Avatar alt="Remy Sharp" src={propertyImage} sx={{ ml: '2px', mr: '10px' }} />
													</div> */}
												<div style={{ marginTop: '10px' }}>{faq.faqTitle}</div>
											</Stack>
										)}
									</TableCell>

									<TableCell align="center">
										{/* <TableCell align="center">{faq.faqTitle}</TableCell> */}
										{/* <TableCell align="center">{faq.faqContent}</TableCell> */}
										<TableCell align="center">
											{faq.faqStatus === FaqStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeFaqHandler(faq._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{faq.faqStatus === FaqStatus.HOLD && (
												<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge warning'}>
													{faq.faqStatus}
												</Button>
											)}

											{faq.faqStatus === FaqStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{faq.faqStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(FaqStatus)
															.filter((ele) => ele !== faq.faqStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateFaqHandler({ _id: faq._id, faqStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
