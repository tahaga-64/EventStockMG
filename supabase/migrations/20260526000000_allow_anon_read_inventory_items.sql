-- STEP 0: 認証なしで在庫一覧を読み取れるようにする（後で認証・権限に置き換える）
CREATE POLICY "anon_read_inventory_items"
ON public.inventory_items
FOR SELECT
TO anon, authenticated
USING (true);
