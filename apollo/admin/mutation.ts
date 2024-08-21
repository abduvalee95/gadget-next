import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberGadgets
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        PROPERTY        *
 *************************/

export const UPDATE_GADGET_BY_ADMIN = gql`
	mutation UpdateGadgetByAdmin($input: GadgetUpdate!) {
    updateGadgetByAdmin(input: $input) {
        _id
        gadgetType
        gadgetStatus
        gadgetLocation
        gadgetColor
        gadgetTitle
        gadgetPrice

        gadgetWeight
        gadgetCapacity
        gadgetViews
        gadgetLikes
        gadgetComments
        gadgetRank
        gadgetImages
        gadgetDesc
        
        
        memberId
        soldAt
        deletedAt
        constructedAt
        createdAt
        updatedAt
    }
}
`;

export const REMOVE_GADGET_BY_ADMIN = gql`
	mutation RemoveGadgetByAdmin($input: String!) {
    removeGadgetByAdmin(gadgetId: $input) {
        _id
        gadgetType
        gadgetStatus
        gadgetLocation
        gadgetColor
        gadgetTitle
        gadgetPrice
        
        gadgetWeight
        gadgetCapacity
        gadgetViews
        gadgetLikes
        gadgetComments
        gadgetRank
        gadgetImages
        gadgetDesc
        
        
        memberId
        soldAt
        deletedAt
        constructedAt
        createdAt
        updatedAt
    }
}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         NOTICE        *
 *************************/

export const CREATE_NOTICE = gql`
	mutation CreateNotice($input: CsInput!) {
    createNotice(input: $input) {
        noticeCategory
        noticeStatus
        noticeTitle
        noticeContent
        memberId
        createdAt
        updatedAt
    }
}`;

export const UPDATE_NOTICE_BY_ADMIN = gql`
	mutation UpdateNoticeByAdmin($input: NoticeUpdate!) {
		updateNoticeByAdmin(noticeId: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_NOTICE_BY_ADMIN = gql`
	mutation RemoveNoticeByAdmin($input: String!) {
		removeNoticeByAdmin(noticeId: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *        FAQ        *
 *************************/

export const CREATE_FAQ_BY_ADMIN = gql`
	mutation CreateFaqByAdmin($input: FaqInput!) {
		createFaqByAdmin(input: $input) {
			_id
			faqCategory
			faqStatus
			faqTitle
			faqContent
			faqViews
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_FAQ_BY_ADMIN = gql`
	mutation UpdateFaqByAdmin($input: FaqUpdate!) {
		updateFaqByAdmin(faqId: $input) {
			_id
			faqCategory
			faqStatus
			faqTitle
			faqContent
			faqViews
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_FAQ_BY_ADMIN = gql`
	mutation RemoveFaqByAdmin($input: String!) {
		removeFaqByAdmin(faqId: $input) {
			_id
			faqCategory
			faqStatus
			faqTitle
			faqContent
			faqViews
			memberId
			createdAt
			updatedAt
		}
	}
`;
