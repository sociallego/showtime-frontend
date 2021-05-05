import { useState, useContext, useRef } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faEllipsisH, faStar } from '@fortawesome/free-solid-svg-icons'
import LikeButton from './LikeButton'
import CommentButton from './CommentButton'
import ShareButton from './ShareButton'
import ReactPlayer from 'react-player'
import mixpanel from 'mixpanel-browser'
import AppContext from '@/context/app-context'
import MiniFollowButton from './MiniFollowButton'
import TokenCardImage from '@/components/TokenCardImage'
import { removeTags, formatAddressShort, truncateWithEllipses } from '@/lib/utilities'

const TokenCard = ({
	originalItem,
	//showDuplicateNFTs,
	//setShowDuplicateNFTs,
	isMyProfile,
	listId,
	//userHiddenItems,
	//setUserHiddenItems,
	//refreshItems,
	setOpenCardMenu,
	openCardMenu,
	changeSpotlightItem,
	currentlyPlayingVideo,
	setCurrentlyPlayingVideo,
	setCurrentlyOpenModal,
	pageProfile,
	handleRemoveItem,
	showUserHiddenItems,
	showDuplicates,
	setHasUserHiddenItems,
}) => {
	const [item, setItem] = useState(originalItem)
	const [moreShown, setMoreShown] = useState(false)
	//const [imageLoaded, setImageLoaded] = useState(false);
	const [showVideo, setShowVideo] = useState(false)
	const [muted, setMuted] = useState(true)
	const [refreshing, setRefreshing] = useState(false)

	const context = useContext(AppContext)

	const divRef = useRef()

	const handleHide = async () => {
		//setUserHiddenItems([...userHiddenItems, item.nft_id]);

		setItem({ ...item, user_hidden: true })
		setHasUserHiddenItems(true)

		// Post changes to the API
		await fetch(`/api/hidenft/${item.nft_id}/${listId}`, {
			method: 'post',
			body: JSON.stringify({
				showDuplicates: showDuplicates ? 1 : 0,
			}),
		})

		if (!showUserHiddenItems) {
			handleRemoveItem(item.nft_id)
		}

		mixpanel.track('Hid item')
	}

	const handleUnhide = async () => {
		//setUserHiddenItems([
		//  ...userHiddenItems.filter((nft_id) => nft_id != item.nft_id),
		//]);

		setItem({ ...item, user_hidden: false })

		// Post changes to the API
		await fetch(`/api/unhidenft/${item.nft_id}/${listId}`, {
			method: 'post',
			body: JSON.stringify({
				showDuplicates: showDuplicates ? 1 : 0,
			}),
		})

		mixpanel.track('Unhid item')
	}

	const handleRefreshNFTMetadata = async () => {
		// Keep these from the original item
		const user_hidden = item.user_hidden
		const owner_id = item.owner_id

		setRefreshing(true)
		const result = await fetch(`/api/refreshmetadata/${item.nft_id}`, {
			method: 'post',
		})
		const { data } = await result.json()
		if (data) {
			// Replace all fields, except those two
			setItem({ ...data, user_hidden: user_hidden, owner_id: owner_id })
		} else {
			handleRemoveItem(item.nft_id)
		}

		//item.name = "THIS";

		//await refreshItems();
		setRefreshing(false)
	}

	/*
  const getImageUrl = (token_aspect_ratio) => {
    var img_url = item.token_img_url ? item.token_img_url : null;

    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      if (token_aspect_ratio && token_aspect_ratio > 1) {
        img_url = img_url.split("=")[0] + "=h660";
      } else {
        img_url = img_url.split("=")[0] + "=w660";
      }
    }
    return img_url;
  };
  */

	const max_description_length = 65

	const getBackgroundColor = item => {
		if (item.token_background_color && item.token_background_color.length === 6) {
			return `#${item.token_background_color}`
		} else {
			return null
		}
	}

	//const hash = item.token_img_url || item.token_animation_url;

	return (
		<div className="w-full h-full">
			<div style={item.user_hidden ? { opacity: 0.7, backgroundColor: '#ddd' } : null} ref={divRef} className="w-full h-full sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all bg-white flex flex-col">
				<div ref={item.imageRef} className="p-4 flex flex-row items-center relative">
					<div className="pr-2 ">
						{item.contract_is_creator ? (
							<Link href="/c/[collection]" as={`/c/${item.collection_slug}`}>
								<a className="flex flex-row items-center ">
									<div>
										<img alt={item.collection_name} src={item.collection_img_url ? item.collection_img_url : 'https://storage.googleapis.com/opensea-static/opensea-profile/4.png'} className="rounded-full w-5 h-5" />
									</div>
									<div className="showtime-card-profile-link ml-2">{truncateWithEllipses(item.collection_name + ' Collection', 30)}</div>
								</a>
							</Link>
						) : item.creator_address ? (
							<Link href="/[profile]" as={`/${item?.creator_username || item.creator_address}`}>
								<a className="flex flex-row items-center ">
									<div>
										<img alt={item.creator_name} src={item.creator_img_url ? item.creator_img_url : 'https://storage.googleapis.com/opensea-static/opensea-profile/4.png'} className="rounded-full w-5 h-5" />
									</div>
									<div className="ml-2 hover:text-stpink truncate">{truncateWithEllipses(item.creator_name, 22)}</div>
								</a>
							</Link>
						) : null}
					</div>

					{context.myProfile?.profile_id !== item.creator_id && !(isMyProfile && listId !== 3) && !item.contract_is_creator && <MiniFollowButton profileId={item.creator_id} />}
					<div className="flex-grow">&nbsp;</div>

					<div>
						{isMyProfile && listId !== 3 ? (
							<div
								onClick={e => {
									e.stopPropagation()

									setOpenCardMenu(openCardMenu == item.nft_id + '_' + listId ? null : item.nft_id + '_' + listId)
								}}
								className="card-menu-button text-right text-gray-600"
							>
								<FontAwesomeIcon className="!w-4 !h-4" icon={faEllipsisH} />
							</div>
						) : null}

						{openCardMenu == item.nft_id + '_' + listId ? (
							<div className="">
								<div className="flex justify-end relative z-10">
									<div className={`absolute text-center top-2 bg-white shadow-lg py-2 px-2 rounded-xl transition-all text-md transform border border-gray-100 ${openCardMenu == item.nft_id + '_' + listId ? 'visible opacity-1 ' : 'invisible opacity-0'}`}>
										<div
											className="py-2 px-3 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap flex flew-row"
											onClick={() => {
												mixpanel.track('Clicked Spotlight Item')
												changeSpotlightItem(item)
											}}
										>
											<div>
												<FontAwesomeIcon className="h-4 w-4 mr-1.5" icon={faStar} />
											</div>
											<div>Spotlight Item</div>
										</div>

										<div className="py-2 px-3 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap" onClick={item.user_hidden ? handleUnhide : handleHide}>
											{item.user_hidden ? `Unhide From ${listId === 1 ? 'Created' : listId === 2 ? 'Owned' : listId === 3 ? 'Liked' : 'List'}` : `Hide From ${listId === 1 ? 'Created' : listId === 2 ? 'Owned' : listId === 3 ? 'Liked' : 'List'}`}
										</div>
										<div className="py-2 px-3 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap" onClick={handleRefreshNFTMetadata}>
											Refresh Metadata
										</div>
									</div>
								</div>
							</div>
						) : null}
					</div>
				</div>
				{item.token_has_video && showVideo && currentlyPlayingVideo === item.nft_id ? (
					<div className="bg-black">
						<ReactPlayer
							url={item.token_animation_url}
							playing={currentlyPlayingVideo === item.nft_id || (item.token_has_video && !item.token_img_url)}
							loop
							controls
							muted={muted}
							width={item.imageRef?.current?.clientWidth}
							height={item.imageRef?.current?.clientWidth}
							playsinline
							//onReady={this.setSpans}
							// Disable downloading & right click
							config={{
								file: {
									attributes: {
										onContextMenu: e => e.preventDefault(),
										controlsList: 'nodownload',
									},
								},
							}}
						/>
					</div>
				) : (
					<div className="relative">
						<div
							className="cursor-pointer"
							onClick={() => {
								mixpanel.track('Open NFT modal')
								setCurrentlyOpenModal(item)
								setShowVideo(false)
								setMuted(true)
								setCurrentlyPlayingVideo(null)
							}}
						>
							<div
								style={{
									backgroundColor: getBackgroundColor(item),
								}}
							>
								<TokenCardImage nft={item} />
							</div>
						</div>
						{item.token_has_video ? (
							<div
								className="p-4 playbutton absolute bottom-0 right-0 cursor-pointer"
								onClick={() => {
									mixpanel.track('Play card video')
									setShowVideo(true)
									setMuted(false)
									setCurrentlyPlayingVideo(item.nft_id)
								}}
							>
								<FontAwesomeIcon className="h-5 w-5 text-white filter drop-shadow" icon={faPlay} />
							</div>
						) : null}
						{refreshing && (
							<div className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-white bg-opacity-50">
								<div className="loading-card-spinner-small mb-2" />
								<div>Refreshing...</div>
							</div>
						)}
					</div>
				)}

				<div className="p-4">
					<div>
						<div className="">
							<div
								onClick={() => {
									mixpanel.track('Open NFT modal')
									setCurrentlyOpenModal(item)

									setShowVideo(false)
									setMuted(true)
									setCurrentlyPlayingVideo(null)
								}}
								className="break-words cursor-pointer truncate"
								style={context.isMobile ? { width: context?.windowSize?.width - 16 * 2 } : {}}
							>
								{item.token_name}
							</div>

							<div style={context.isMobile ? { width: context?.windowSize?.width - 16 * 2 } : {}} className="break-words cursor-pointer truncate py-4 text-gray-500 text-sm">
								{moreShown ? (
									<div className="whitespace-pre-line">{removeTags(item.token_description)}</div>
								) : (
									<div>
										{item.token_description?.length > max_description_length ? (
											<>
												{truncateWithEllipses(removeTags(item.token_description), max_description_length)}{' '}
												<a onClick={() => setMoreShown(true)} className="text-gray-900 hover:text-gray-500 cursor-pointer">
													{' '}
													more
												</a>
											</>
										) : (
											<div>{removeTags(item.token_description)}</div>
										)}
									</div>
								)}
							</div>
						</div>

						<div className="flex items-center">
							<div className="mr-4">
								<LikeButton item={item} />
							</div>
							<div className="mr-4">
								<CommentButton
									item={item}
									handleComment={() => {
										mixpanel.track('Open NFT modal via comment button')
										setCurrentlyOpenModal(item)
										setShowVideo(false)
										setMuted(true)
										setCurrentlyPlayingVideo(null)
									}}
								/>
							</div>
							<div>
								<ShareButton url={window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + `/t/${item.contract_address}/${item.token_id}`} type={'item'} />
							</div>
						</div>
					</div>
				</div>
				<div className="flex-1 flex items-end w-full">
					<div className="border-t border-gray-300 p-4 flex flex-col w-full">
						<div className="flex-shrink pr-2 text-xs text-gray-500 mb-1">Owned by</div>
						<div>
							{item.owner_count && item.owner_count > 1 ? (
								pageProfile && listId === 2 ? (
									<div className="flex flex-row items-center pt-1">
										<Link href="/[profile]" as={`/${pageProfile.slug_address}`}>
											<a className="flex flex-row items-center pr-2 ">
												<div>
													<img alt={pageProfile.name && pageProfile.name != 'Unnamed' ? pageProfile.name : pageProfile.username ? pageProfile.username : pageProfile.wallet_addresses_excluding_email.length > 0 ? formatAddressShort(pageProfile.wallet_addresses_excluding_email[0]) : 'Unknown'} src={pageProfile.img_url ? pageProfile.img_url : 'https://storage.googleapis.com/opensea-static/opensea-profile/4.png'} className="rounded-full mr-2 h-6 w-6" />
												</div>
												<div className="showtime-card-profile-link">
													{truncateWithEllipses(
														pageProfile.name && pageProfile.name != 'Unnamed' ? pageProfile.name : pageProfile.username ? pageProfile.username : pageProfile.wallet_addresses_excluding_email.length > 0 ? formatAddressShort(pageProfile.wallet_addresses_excluding_email[0]) : 'Unknown',

														14
													)}
												</div>
											</a>
										</Link>

										<div className="text-gray-400 text-sm mr-2 -ml-1 mt-px">
											& {item.owner_count - 1} other
											{item.owner_count - 1 > 1 ? 's' : null}
										</div>
										{context.myProfile?.profile_id !== item.owner_id && <MiniFollowButton profileId={item.owner_id} />}
										<div className="flex-grow">&nbsp;</div>
									</div>
								) : (
									<span className="text-gray-500">Multiple owners</span>
								)
							) : item.owner_id ? (
								<div className="flex flex-row items-center pt-1">
									<Link href="/[profile]" as={`/${item?.owner_username || item.owner_address}`}>
										<a className="flex flex-row items-center pr-2 ">
											<div>
												<img alt={item.owner_name} src={item.owner_img_url ? item.owner_img_url : 'https://storage.googleapis.com/opensea-static/opensea-profile/4.png'} className="rounded-full mr-2 w-6 h-6" />
											</div>
											<div className="showtime-card-profile-link">{truncateWithEllipses(item.owner_name, 24)}</div>
										</a>
									</Link>
									{context.myProfile?.profile_id !== item.owner_id && !(isMyProfile && listId !== 3) && <MiniFollowButton profileId={item.owner_id} />}
									<div className="flex-grow">&nbsp;</div>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TokenCard