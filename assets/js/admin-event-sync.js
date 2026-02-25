/**
 * Admin Event Sync Script
 *
 * Handles AJAX synchronization between WordPress and Action Network
 */
jQuery(document).ready(function($) {
	$('#houseyou_sync_event').on('click', function(e) {
		e.preventDefault();

		var button = $(this);
		var status = $('#houseyou_sync_status');
		var postId = houseyouEventSync.postId;

		// Get event ID from button data attribute (set from ACF or manual field)
		var eventId = button.attr('data-event-id');

		if (!eventId) {
			status.html('<span style="color: #dc3232;">❌ No Event ID detected</span>');
			return;
		}

		// Disable button and show loading
		button.prop('disabled', true).text('⏳ Syncing...');
		status.html('<span style="color: #666;">Fetching data from Action Network...</span>');

		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: {
				action: 'houseyou_sync_event',
				nonce: houseyouEventSync.nonce,
				post_id: postId,
				event_id: eventId
			},
			success: function(response) {
				if (response.success) {
					// Update form fields with synced data
					if (response.data.date) $('#event_date').val(response.data.date);
					if (response.data.time) $('#event_time').val(response.data.time);
					if (response.data.end_time) $('#event_end_time').val(response.data.end_time);
					if (response.data.location) $('#event_location').val(response.data.location);

					status.html('<span style="color: #46b450;">✓ ' + response.data.message + '</span>');

					// Show reminder to save
					setTimeout(function() {
						status.html('<span style="color: #46b450;">✓ Synced! Click "Update" to save changes.</span>');
					}, 2000);
				} else {
					status.html('<span style="color: #dc3232;">❌ ' + response.data.message + '</span>');
				}
			},
			error: function() {
				status.html('<span style="color: #dc3232;">❌ Connection failed. Please try again.</span>');
			},
			complete: function() {
				button.prop('disabled', false).text('🔄 Sync from Action Network');
			}
		});
	});
});
