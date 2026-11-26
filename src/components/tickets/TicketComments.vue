<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useTicketComments } from '@/composable/useTicketComments'
import { sanitizeRichText } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import type { TicketComment as TicketCommentType } from '@/types/comment'
import { hasMeaningfulText } from '@/utils/textChecker'
import CommentEditor from './CommentEditor.vue'

const props = defineProps<{
  ticketId: number
}>()

const authStore = useAuthStore()
const { comments, isFetching, isSubmitting, errorMessage, fetchComments, addComment } =
  useTicketComments()
const draft = ref('')
const isEditorExpanded = ref(false)

watch(
  () => props.ticketId,
  async (ticketId) => {
    if (!Number.isInteger(ticketId) || ticketId <= 0) return

    await fetchComments(ticketId)

    if (errorMessage.value) {
      toast.error(errorMessage.value)
    }
  },
  { immediate: true },
)

const authorName = (comment: TicketCommentType) =>
  comment.authorName?.trim() ||
  (comment.userId === authStore.profile?.id ? authStore.profile.fullName?.trim() : '') ||
  'User'

const authorAvatar = (comment: TicketCommentType) =>
  comment.authorAvatarUrl ||
  (comment.userId === authStore.profile?.id ? authStore.profile.avatarUrl : null)

const authorInitial = (comment: TicketCommentType) =>
  authorName(comment).charAt(0).toUpperCase() || 'U'

const formattedDate = (createdAt: string) => new Date(createdAt).toLocaleString()

const canSubmit = computed(() => hasMeaningfulText(draft.value))

const submitComment = async () => {
  if (!canSubmit.value || isSubmitting.value) return

  const comment = await addComment(props.ticketId, draft.value)

  if (!comment) {
    toast.error(errorMessage.value ?? 'Failed to add comment.')
    return
  }

  draft.value = ''
  isEditorExpanded.value = false
  toast.success('Comment added.')
}
</script>

<template>
  <section class="space-y-5 rounded-lg border border-border bg-card p-5">
    <div>
      <h2 class="text-lg font-semibold">Comments</h2>
    </div>

    <div v-if="isFetching" class="py-6 text-center text-sm text-muted-foreground">
      Loading comments...
    </div>

    <div
      v-if="errorMessage && !isFetching"
      role="alert"
      class="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
    >
      {{ errorMessage }}
    </div>

    <div v-if="!isFetching && comments.length === 0" class="py-4 text-sm text-muted-foreground">
      No comments yet. Start the conversation.
    </div>

    <ol v-if="!isFetching && comments.length > 0" class="space-y-5">
      <li
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-3 border-b border-border pb-5 last:border-0 last:pb-0"
      >
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700"
        >
          <img
            v-if="authorAvatar(comment)"
            :src="authorAvatar(comment) ?? undefined"
            :alt="`${authorName(comment)}'s avatar`"
            class="h-full w-full object-cover"
          />
          <span v-else>{{ authorInitial(comment) }}</span>
        </div>

        <div class="min-w-0 flex-1">
          <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span class="text-sm font-medium">{{ authorName(comment) }}</span>
            <time :datetime="comment.createdAt" class="text-xs text-muted-foreground">
              {{ formattedDate(comment.createdAt) }}
            </time>
          </div>
          <div
            class="comment-content text-sm leading-6"
            v-html="sanitizeRichText(comment.content)"
          />
        </div>
      </li>
    </ol>

    <CommentEditor
      v-model:content="draft"
      v-model:expanded="isEditorExpanded"
      :is-submitting="isSubmitting"
      @submit="submitComment"
    />
  </section>
</template>

<style scoped>
.comment-content :deep(p) {
  margin: 0 0 0.5rem;
}

.comment-content :deep(p:last-child) {
  margin-bottom: 0;
}

.comment-content :deep(ul) {
  list-style: disc;
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.comment-content :deep(ol) {
  list-style: decimal;
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.comment-content :deep(a) {
  color: #1d4ed8;
  text-decoration: underline;
}
</style>
