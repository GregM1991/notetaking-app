<script lang="ts">
	import { EditNote } from '$lib/components'
	import type { PageData } from '../$types'
	import type { ActionData } from '../../$types'
	import { page } from '$app/stores'
	export let data: PageData
	export let formData: ActionData
	const action = `/users/${$page.params.username}/notes/${$page.params.noteid}/edit?/newOrUpdate`
</script>


<EditNote {action} errors={formData?.errors} title={data.note.title} content={data.note.content} />
