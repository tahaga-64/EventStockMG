-- STEP 5: 追加購入フラグ（needs_reorder）をクライアントから更新できるようにする
-- TODO: STEP 認証導入後は authenticated のみ・列単位の制限に差し替える
CREATE POLICY "anon_update_inventory_items"
ON public.inventory_items
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
