/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Check } from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { useParams } from "next/navigation";

import { useUserInfo } from "@/features/users/hooks/use-user-info";
import { useMe } from "@/features/auth/hooks/use-me";
import usePostCollections from "@/features/post-collections/hooks/use-post-collections";
import useFollowAUser from "@/features/users/hooks/use-follow-a-user";
import useUnfollowAUser from "@/features/users/hooks/use-unfollow-a-user";

import EditProfileModal from "./components/edit-profile-modal";
import CreateCollectionModal from "./components/create-collection-modal";
import ArticleCollectionsSection from "./components/article-collections-section";
import LikedPosts from "./components/liked-posts";
import RepostedPosts from "./components/reposted-posts";
import OwnPosts from "./components/own-posts";
import { useAppDispatch } from "@/store/hooks";
import { setSignInModalState } from "@/features/app-settings/slice";
import Loading from "@/shared/components/loading";
import UpdatePasswordModal from "./components/update-password-modal";
import { useNotification } from "@/hooks/use-notification";

type Tab = "Posts" | "Collections" | "Reposts" | "Likes";

const allTabs: Tab[] = ["Posts", "Collections", "Reposts", "Likes"];

const tabLabels: Record<Tab, string> = {
  Posts: "Letters",
  Collections: "Collections",
  Reposts: "Reposts",
  Likes: "Likes",
};

function normalizeUrl(url?: string | null) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

export default function UserInfoPage() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Posts");
  const { pushNotification } = useNotification();

  const params = useParams();
  const userSlug = params.userSlug as string;

  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    refetch: refetchUserInfo,
  } = useUserInfo(userSlug);

  const { data: myInfo } = useMe();

  const isMyProfile = Boolean(
    myInfo?.id && userInfo?.id && myInfo.id === userInfo.id
  );

  const { data: collections } = usePostCollections(userInfo?.id, isMyProfile);

  const { mutate: followAUser } = useFollowAUser();
  const { mutate: unfollowAUser } = useUnfollowAUser();

  const dispatch = useAppDispatch();

  const openSignInModal = () => {
    dispatch(setSignInModalState({ isOpen: true }));
  };

  if (isLoadingUserInfo) {
    return <Loading />;
  }

  if (!userInfo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--midnight-bg)] px-5 text-[var(--midnight-text)]">
        <section className="mx-auto max-w-2xl text-center">
          <p className="text-xs tracking-[0.18em] text-[var(--midnight-soft)]">
            WRITER NOT FOUND
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-[-0.07em] md:text-7xl">
            This writer vanished
          </h1>

          <p className="mt-6 text-lg leading-8 text-[var(--midnight-muted)]">
            We could not find a writer called{" "}
            <span className="font-medium text-[var(--midnight-text)]">
              {userSlug}
            </span>
            . The profile may have been removed, renamed, or never existed.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-[var(--midnight-border)]/70 px-5 py-2.5 text-sm font-medium text-[var(--midnight-muted)] transition hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-text)]"
            >
              Return home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const displayName = userInfo.fullName ?? "Untitled writer";
  const introduction =
    userInfo.introduction || "No introduction has been written yet.";
  const avatar = userInfo.avatar;

  const socialLinks = [
    {
      label: "Website",
      href: normalizeUrl(userInfo.social?.website),
      icon: Globe,
    },
    {
      label: "Facebook",
      href: normalizeUrl(userInfo.social?.facebook),
      icon: FaFacebookF,
    },
    {
      label: "X",
      href: normalizeUrl(userInfo.social?.x),
      icon: FaXTwitter,
    },
    {
      label: "LinkedIn",
      href: normalizeUrl(userInfo.social?.linkedin),
      icon: FaLinkedinIn,
    },
    {
      label: "YouTube",
      href: normalizeUrl(userInfo.social?.youtube),
      icon: FaYoutube,
    },
  ].filter((item) => Boolean(item.href));

  const tabs = allTabs.filter((tab) => {
    if (tab === "Collections" && !isMyProfile) return false;
    return true;
  });

  const isFollowed = isMyProfile
    ? false
    : myInfo?.followings.some((following) => following.id === userInfo.id);

  return (
    <main className="min-h-screen bg-[var(--midnight-bg)] text-[var(--midnight-text)]">
      <section className="relative overflow-hidden border-b border-[var(--midnight-border)]/70">
        {userInfo.backgroundImage && (
          <img
            alt="user-info-background"
            src={userInfo.backgroundImage}
            className="absolute inset-0 z-[1] h-full w-full object-cover object-center blur-xs brightness-50"
            fetchPriority="high"
          />
        )}

        <div className="relative z-2 mx-auto max-w-3xl px-5 py-14">
          <div className="flex items-start gap-5">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="h-20 w-20 rounded-full border border-[var(--midnight-border)]/70 object-cover opacity-95"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-2xl font-bold text-[var(--midnight-accent)]">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                Writer archive
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-[-0.055em] text-[var(--midnight-text)] md:text-5xl">
                {displayName}
              </h1>

              <p className="mt-2 text-sm text-[var(--midnight-muted)]">
                @{userInfo.slug}
              </p>
            </div>
          </div>

          <p className="mt-9 max-w-2xl text-[17px] leading-8 text-[var(--midnight-muted)]">
            {introduction}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--midnight-soft)]">
            <span>{userInfo.statistics.followersCount} &nbsp;followers</span>
            <span>{userInfo.statistics.postsCount} &nbsp;letters</span>
          </div>

          {socialLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)]/70 px-3 py-1.5 text-sm text-[var(--midnight-muted)] transition hover:border-[var(--midnight-accent)]/60 hover:text-[var(--midnight-text)]"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex min-h-9 flex-wrap items-center gap-3">
            {isMyProfile ? (
              <>
                <Link
                  href="/new-letter"
                  className="rounded-full bg-[var(--midnight-accent)] px-5 py-2 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
                >
                  Write a letter
                </Link>

                <button
                  type="button"
                  onClick={() => setIsCreateCollectionOpen(true)}
                  className="rounded-full border border-[var(--midnight-border)]/70 px-5 py-2 text-sm font-medium text-[var(--midnight-muted)] transition hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)]"
                >
                  Create collection
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(true)}
                  className="rounded-full border border-[var(--midnight-border)]/70 px-5 py-2 text-sm font-medium text-[var(--midnight-muted)] transition hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)]"
                >
                  Edit profile
                </button>

                <button
                  type="button"
                  onClick={() => setIsUpdatePasswordOpen(true)}
                  className="rounded-full border border-[var(--midnight-border)]/70 px-5 py-2 text-sm font-medium text-[var(--midnight-muted)] transition hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)]"
                >
                  Update password
                </button>
              </>
            ) : (
              <button
                type="button"
                className={`group inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  isFollowed
                    ? "border border-[var(--midnight-border)] bg-[var(--midnight-code-bg)] text-[var(--midnight-text)] hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                    : "bg-[var(--midnight-accent)] text-[var(--midnight-on-accent)] shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:scale-[1.02] hover:opacity-95"
                }`}
                onClick={() => {
                  if (!myInfo?.id) {
                    openSignInModal();
                    return;
                  }

                  if (isFollowed) {
                    unfollowAUser(userInfo, {
                      onSuccess: () => refetchUserInfo(),
                    });
                    return;
                  }

                  followAUser(userInfo, {
                    onSuccess: () => refetchUserInfo(),
                  });
                }}
              >
                {isFollowed ? (
                  <>
                    <span className="flex items-center gap-2 transition-all group-hover:hidden">
                      <Check className="h-4 w-4" />
                      Following
                    </span>

                    <span className="hidden transition-all group-hover:inline">
                      Unfollow
                    </span>
                  </>
                ) : (
                  <span>Follow</span>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-5">
          <nav className="flex gap-6 overflow-x-auto border-b border-[var(--midnight-border)]/70 text-sm text-[var(--midnight-muted)]">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-b py-4 transition-colors ${
                  activeTab === tab
                    ? "border-[var(--midnight-accent)] font-medium text-[var(--midnight-text)]"
                    : "border-transparent hover:text-[var(--midnight-accent-hover)]"
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </nav>

          <section className="py-8">
            {activeTab === "Posts" && <OwnPosts userId={userInfo.id} />}

            {activeTab === "Collections" && (
              <ArticleCollectionsSection collections={collections ?? []} />
            )}

            {activeTab === "Reposts" && <RepostedPosts slug={userInfo.slug} />}

            {activeTab === "Likes" && <LikedPosts slug={userInfo.slug} />}
          </section>
        </div>
      </section>

      <EditProfileModal
        open={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userInfo={userInfo}
        refetch={refetchUserInfo}
      />

      <UpdatePasswordModal
        open={isUpdatePasswordOpen}
        onSuccess={() => {
          pushNotification("Update password success", "success");
        }}
        onError={(errMsg) => {
          pushNotification(errMsg, "error");
        }}
        onClose={() => setIsUpdatePasswordOpen(false)}
      />

      <CreateCollectionModal
        open={isCreateCollectionOpen}
        onClose={() => setIsCreateCollectionOpen(false)}
      />
    </main>
  );
}
